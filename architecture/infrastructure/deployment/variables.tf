variable "region" {
  description = "AWS region where resources will be provisioned"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g., prod or staging)"
  type        = string
  default     = "prod"
}

variable "vpc_id" {
  description = "Existing VPC ID to deploy resources into"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the ECS cluster"
  type        = list(string)
}

variable "db_username" {
  description = "Database username for PostgreSQL"
  type        = string
}

variable "db_password_secret_arn" {
  description = "ARN of AWS Secrets Manager secret containing DB password"
  type        = string
}

variable "cache_password_secret_arn" {
  description = "ARN of AWS Secrets Manager secret containing Redis password"
  type        = string
}

variable "image_admin_console" {
  description = "ECR image URI for Admin Console"
  type        = string
}

variable "image_api" {
  description = "ECR image URI for REST API"
  type        = string
}

variable "image_sdk" {
  description = "ECR image URI for Python SDK (embedded mode)"
  type        = string
}

variable "image_core_engine" {
  description = "ECR image URI for Engine Core"
  type        = string
}

variable "image_scheduler" {
  description = "ECR image URI for Scheduler"
  type        = string
}

variable "image_guardrails_runtime" {
  description = "ECR image URI for OpenGuardrails Runtime"
  type        = string
}

variable "image_cache" {
  description = "ECR image URI for Redis (optional; could be managed service)"
  type        = string
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "drpe"
}

variable "cache_cluster_name" {
  description = "Name of the ElastiCache Redis cluster"
  type        = string
  default     = "drpe-redis"
}
