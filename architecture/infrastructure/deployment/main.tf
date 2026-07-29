#########################
# Data Sources
#########################
data "aws_vpc" "selected" {
  id = var.vpc_id
}

data "aws_subnet_ids" "selected" {
  vpc_id = var.vpc_id
}

#########################
# IAM Roles
#########################
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs_task_execution_role-${var.environment}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_logs" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task_role" {
  name = "ecs_task_role-${var.environment}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_policy" "ecs_task_secrets" {
  name        = "ecs_task_secrets_policy-${var.environment}"
  description = "Allow ECS tasks to read secrets from Secrets Manager"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = [var.db_password_secret_arn, var.cache_password_secret_arn]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_secrets" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_task_secrets.arn
}

#########################
# ECS Cluster
#########################
resource "aws_ecs_cluster" "drpe_cluster" {
  name = "drpe-cluster-${var.environment}"
  tags = {
    Environment = var.environment
  }
}

#########################
# Security Group
#########################
resource "aws_security_group" "ecs_sg" {
  name   = "ecs_sg-${var.environment}"
  vpc_id = data.aws_vpc.selected.id
  description = "Security group for DRPE ECS services"
  tags = {
    Environment = var.environment
  }

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all inbound traffic (adjust as needed)"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }
}

#########################
# RDS PostgreSQL
#########################
resource "aws_db_subnet_group" "drpe_subnet_group" {
  name       = "drpe-subnet-group-${var.environment}"
  subnet_ids = data.aws_subnet_ids.selected.ids
  tags = {
    Environment = var.environment
  }
}

resource "aws_rds_cluster" "postgres" {
  engine                 = "postgres"
  engine_version         = "15.7"
  database_name          = var.db_name
  db_subnet_group_name   = aws_db_subnet_group.drpe_subnet_group.name
  vpc_security_group_ids = [aws_security_group.ecs_sg.id]
  skip_final_snapshot    = true
  master_username        = var.db_username
  master_secret_name     = var.db_password_secret_arn
  backup_retention_period = 7
  tags = {
    Environment = var.environment
  }
}

#########################
# ElastiCache Redis
#########################
resource "aws_elasticache_subnet_group" "redis_subnet_group" {
  name       = "redis-subnet-group-${var.environment}"
  subnet_ids = data.aws_subnet_ids.selected.ids
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = var.cache_cluster_name
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnet_group.name
  security_group_ids   = [aws_security_group.ecs_sg.id]
  parameter_group_name = "default.redis7"
  tags = {
    Environment = var.environment
  }
}

#########################
# ECS Task Definitions
#########################
locals {
  task_definitions = [
    {
      name   = "admin-console"
      image  = var.image_admin_console
      port   = 3000
      env    = {}
    },
    {
      name   = "api"
      image  = var.image_api
      port   = 8000
      env    = {
        "DB_ENDPOINT"  = aws_rds_cluster.postgres.endpoint
        "CACHE_ENDPOINT" = aws_elasticache_cluster.redis.cache_nodes[0].address
      }
    },
    {
      name   = "sdk"
      image  = var.image_sdk
      port   = 0
      env    = {}
    },
    {
      name   = "core-engine"
      image  = var.image_core_engine
      port   = 0
      env    = {}
    },
    {
      name   = "scheduler"
      image  = var.image_scheduler
      port   = 0
      env    = {}
    },
    {
      name   = "guardrails-runtime"
      image  = var.image_guardrails_runtime
      port   = 0
      env    = {}
    },
    {
      name   = "cache"
      image  = var.image_cache
      port   = 6379
      env    = {}
    }
  ]
}

resource "aws_ecs_task_definition" "drpe_task" {
  for_each = { for td in local.task_definitions : td.name => td }

  family                   = "${each.key}-family"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([{
    name      = each.value.name
    image     = each.value.image
    cpu       = 256
    memory    = 512
    portMappings = [
      for p in [each.value.port] : p > 0 ? {
        containerPort = p
        hostPort      = p
        protocol      = "tcp"
      } : null
    ]
    environment = [
      for k, v in each.value.env : {
        name  = k
        value = v
      }
    ]
    essential = true
  }])
}

#########################
# ECS Services
#########################
resource "aws_ecs_service" "drpe_service" {
  for_each = aws_ecs_task_definition.drpe_task

  name            = each.key
  cluster         = aws_ecs_cluster.drpe_cluster.id
  task_definition = each.value.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets         = data.aws_subnet_ids.selected.ids
    security_groups = [aws_security_group.ecs_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    # Placeholder: Add target groups if using ALB/NGINX
  }

  depends_on = [
    aws_ecs_cluster.drpe_cluster,
    aws_security_group.ecs_sg
  ]

  tags = {
    Environment = var.environment
  }
}
