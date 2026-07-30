output "namespace" {
  description = "Namespace where all resources are deployed"
  value       = kubernetes_namespace.drpe.metadata[0].name
}

output "admin_console_service_url" {
  description = "Service URL for Admin Console"
  value       = "http://${kubernetes_service.admin_console.metadata[0].name}.${var.namespace}.svc.cluster.local:80"
}

output "api_service_url" {
  description = "Service URL for REST API"
  value       = "http://${kubernetes_service.api.metadata[0].name}.${var.namespace}.svc.cluster.local:80"
}

output "sdk_service_url" {
  description = "Service URL for Python SDK"
  value       = "http://${kubernetes_service.sdk.metadata[0].name}.${var.namespace}.svc.cluster.local:80"
}

output "core_engine_service_url" {
  description = "Service URL for Engine Core"
  value       = "http://${kubernetes_service.core_engine.metadata[0].name}.${var.namespace}.svc.cluster.local:80"
}

output "scheduler_service_url" {
  description = "Service URL for Scheduler"
  value       = "http://${kubernetes_service.scheduler.metadata[0].name}.${var.namespace}.svc.cluster.local:80"
}

output "cache_service_url" {
  description = "Service URL for Redis Cache"
  value       = "http://${kubernetes_service.cache.metadata[0].name}.${var.namespace}.svc.cluster.local:80"
}

output "guardrails_runtime_service_url" {
  description = "Service URL for OpenGuardrails Runtime"
  value       = "http://${kubernetes_service.guardrails_runtime.metadata[0].name}.${var.namespace}.svc.cluster.local:80"
}

output "db_service_url" {
  description = "Service URL for PostgreSQL"
  value       = "http://${kubernetes_service.db.metadata[0].name}.${var.namespace}.svc.cluster.local:80"
}
