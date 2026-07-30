variable "region" {
  description = "AWS region where resources will be deployed"
  type        = string
  default     = "eu-west-1"
}

variable "cluster_name_prefix" {
  description = "Prefix used for EKS cluster names"
  type        = string
  default     = "drpe"
}

variable "node_instance_type" {
  description = "EC2 instance type for EKS worker nodes"
  type        = string
  default     = "t3.medium"
}

variable "node_desired_capacity" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "db_instance_class" {
  description = "RDS PostgreSQL instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "db_name" {
  description = "Database name for PostgreSQL"
  type        = string
  default     = "drpe_db"
}

variable "db_username" {
  description = "Master username for PostgreSQL"
  type        = string
  default     = "drpe_user"
}

variable "db_password" {
  description = "Master password for PostgreSQL (sensitive)"
  type        = string
  sensitive   = true
}

variable "redis_cluster_id" {
  description = "ElastiCache Redis cluster ID"
  type        = string
  default     = "drpe-redis"
}
