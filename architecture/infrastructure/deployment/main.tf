#############################
# IAM Role for EKS Cluster
#############################
resource "aws_iam_role" "eks_cluster_role" {
  name = "${var.cluster_name_prefix}-eks-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = { Service = "eks.amazonaws.com" }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_role_attachment" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

#############################
# EKS Cluster - Production
#############################
resource "aws_eks_cluster" "prod" {
  name     = "${var.cluster_name_prefix}-prod"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = var.prod_subnet_ids
  }

  depends_on = [aws_iam_role_policy_attachment.eks_cluster_role_attachment]
}

resource "aws_eks_node_group" "prod" {
  cluster_name    = aws_eks_cluster.prod.name
  node_group_name = "${var.cluster_name_prefix}-prod-ng"
  node_role_arn   = aws_iam_role.eks_cluster_role.arn

  scaling_config {
    desired_size = var.node_desired_capacity
    max_size     = var.node_desired_capacity
    min_size     = 1
  }

  instance_types = [var.node_instance_type]

  vpc_config {
    subnet_ids = var.prod_subnet_ids
  }
}

#############################
# RDS PostgreSQL - Production
#############################
resource "aws_db_instance" "prod" {
  identifier              = "${var.cluster_name_prefix}-prod-db"
  engine                  = "postgres"
  instance_class          = var.db_instance_class
  allocated_storage       = 20
  db_subnet_group_name    = var.prod_db_subnet_group
  vpc_security_group_ids = [var.prod_security_group_id]

  username = var.db_username
  password = var.db_password
  name     = var.db_name

  skip_final_snapshot = true
}

#############################
# ElastiCache Redis - Production
#############################
resource "aws_elasticache_cluster" "prod" {
  cluster_id           = "${var.cluster_name_prefix}-prod-redis"
  engine               = "redis"
  node_type            = var.redis_node_type
  num_cache_nodes      = 1
  subnet_group_name    = var.prod_redis_subnet_group
  security_group_ids   = [var.prod_security_group_id]
}

#############################
# EKS Cluster - Staging
#############################
resource "aws_eks_cluster" "staging" {
  name     = "${var.cluster_name_prefix}-staging"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = var.staging_subnet_ids
  }

  depends_on = [aws_iam_role_policy_attachment.eks_cluster_role_attachment]
}

resource "aws_eks_node_group" "staging" {
  cluster_name    = aws_eks_cluster.staging.name
  node_group_name = "${var.cluster_name_prefix}-staging-ng"
  node_role_arn   = aws_iam_role.eks_cluster_role.arn

  scaling_config {
    desired_size = var.node_desired_capacity
    max_size     = var.node_desired_capacity
    min_size     = 1
  }

  instance_types = [var.node_instance_type]

  vpc_config {
    subnet_ids = var.staging_subnet_ids
  }
}

#############################
# RDS PostgreSQL - Staging
#############################
resource "aws_db_instance" "staging" {
  identifier              = "${var.cluster_name_prefix}-staging-db"
  engine                  = "postgres"
  instance_class          = var.db_instance_class
  allocated_storage       = 20
  db_subnet_group_name    = var.staging_db_subnet_group
  vpc_security_group_ids = [var.staging_security_group_id]

  username = var.db_username
  password = var.db_password
  name     = var.db_name

  skip_final_snapshot = true
}

#############################
# ElastiCache Redis - Staging
#############################
resource "aws_elasticache_cluster" "staging" {
  cluster_id           = "${var.cluster_name_prefix}-staging-redis"
  engine               = "redis"
  node_type            = var.redis_node_type
  num_cache_nodes      = 1
  subnet_group_name    = var.staging_redis_subnet_group
  security_group_ids   = [var.staging_security_group_id]
}
