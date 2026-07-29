output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.drpe_cluster.name
}

output "db_endpoint" {
  description = "Endpoint address of the PostgreSQL RDS cluster"
  value       = aws_rds_cluster.postgres.endpoint
  sensitive   = false
}

output "redis_endpoint" {
  description = "Endpoint address of the Redis ElastiCache cluster"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
  sensitive   = false
}

output "ecs_task_execution_role_arn" {
  description = "ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution_role.arn
}

output "ecs_task_role_arn" {
  description = "ARN of the ECS task role"
  value       = aws_iam_role.ecs_task_role.arn
}
