#############################
# EKS Cluster Endpoints
#############################
output "eks_cluster_endpoint_prod" {
  description = "Endpoint URL for production EKS cluster"
  value       = aws_eks_cluster.prod.endpoint
}

output "eks_cluster_endpoint_staging" {
  description = "Endpoint URL for staging EKS cluster"
  value       = aws_eks_cluster.staging.endpoint
}

#############################
# RDS Endpoints
#############################
output "rds_endpoint_prod" {
  description = "Endpoint address for production PostgreSQL instance"
  value       = aws_db_instance.prod.endpoint
}

output "rds_endpoint_staging" {
  description = "Endpoint address for staging PostgreSQL instance"
  value       = aws_db_instance.staging.endpoint
}

#############################
# ElastiCache Endpoints
#############################
output "elasticache_endpoint_prod" {
  description = "Endpoint address for production Redis cluster"
  value       = aws_elasticache_cluster.prod.cache_nodes[0].address
}

output "elasticache_endpoint_staging" {
  description = "Endpoint address for staging Redis cluster"
  value       = aws_elasticache_cluster.staging.cache_nodes[0].address
}
