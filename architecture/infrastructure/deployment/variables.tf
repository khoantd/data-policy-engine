variable "kubeconfig_path" {
  description = "Path to the kubeconfig file for cluster access"
  type        = string
}

variable "namespace" {
  description = "Kubernetes namespace for the application stack"
  type        = string
  default     = "drpe"
}

variable "environment" {
  description = "Deployment environment (e.g., prod, staging)"
  type        = string
  default     = "prod"
}

variable "region" {
  description = "Geographic region of the cluster"
  type        = string
  default     = "eu-west-1"
}

variable "cluster_name" {
  description = "Name of the Kubernetes cluster"
  type        = string
  default     = "k8s-cluster"
}

# Container image variables
variable "image_admin_console" {
  description = "Docker image for the Admin Console"
  type        = string
  default     = "registry.local/admin-console:latest"
}

variable "image_api" {
  description = "Docker image for the REST API"
  type        = string
  default     = "registry.local/api:latest"
}

variable "image_sdk" {
  description = "Docker image for the Python SDK"
  type        = string
  default     = "registry.local/sdk:latest"
}

variable "image_core_engine" {
  description = "Docker image for the Engine Core"
  type        = string
  default     = "registry.local/core-engine:latest"
}

variable "image_scheduler" {
  description = "Docker image for the Scheduler"
  type        = string
  default     = "registry.local/scheduler:latest"
}

variable "image_cache" {
  description = "Docker image for the Redis cache"
  type        = string
  default     = "redis:7"
}

variable "image_guardrails_runtime" {
  description = "Docker image for the OpenGuardrails Runtime"
  type        = string
  default     = "registry.local/guardrails-runtime:latest"
}

variable "image_db" {
  description = "Docker image for PostgreSQL"
  type        = string
  default     = "postgres:15"
}
