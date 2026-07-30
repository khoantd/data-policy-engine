# Namespace
resource "kubernetes_namespace" "drpe" {
  metadata {
    name = var.namespace
  }
}

# Helper for service names
locals {
  services = {
    admin_console        = "admin-console-service"
    api                  = "api-service"
    sdk                  = "sdk-service"
    core_engine          = "core-engine-service"
    scheduler            = "scheduler-service"
    cache                = "cache-service"
    guardrails_runtime   = "guardrails-runtime-service"
    db                   = "db-service"
  }
}

# Deployments & Services

# Admin Console
resource "kubernetes_deployment" "admin_console" {
  metadata {
    name      = "admin-console"
    namespace = var.namespace
    labels = {
      app = "admin-console"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "admin-console"
      }
    }
    template {
      metadata {
        labels = {
          app = "admin-console"
        }
      }
      spec {
        container {
          name  = "admin-console"
          image = var.image_admin_console

          port {
            container_port = 3000
          }

          env {
            name  = "DRPE_API_URL"
            value = "http://${local.services.api}.${var.namespace}.svc.cluster.local:80"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "admin_console" {
  metadata {
    name      = local.services.admin_console
    namespace = var.namespace
    labels = {
      app = "admin-console"
    }
  }
  spec {
    selector = {
      app = "admin-console"
    }
    port {
      protocol = "TCP"
      port     = 80
      target_port = 3000
    }
    type = "ClusterIP"
  }
}

# REST API
resource "kubernetes_deployment" "api" {
  metadata {
    name      = "api"
    namespace = var.namespace
    labels = {
      app = "api"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "api"
      }
    }
    template {
      metadata {
        labels = {
          app = "api"
        }
      }
      spec {
        container {
          name  = "api"
          image = var.image_api

          port {
            container_port = 8000
          }

          env {
            name  = "POSTGRES_HOST"
            value = "${local.services.db}.${var.namespace}.svc.cluster.local"
          }

          env {
            name  = "REDIS_HOST"
            value = "${local.services.cache}.${var.namespace}.svc.cluster.local"
          }

          env {
            name  = "GUARDRAILS_RUNTIME_HOST"
            value = "${local.services.guardrails_runtime}.${var.namespace}.svc.cluster.local"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "api" {
  metadata {
    name      = local.services.api
    namespace = var.namespace
    labels = {
      app = "api"
    }
  }
  spec {
    selector = {
      app = "api"
    }
    port {
      protocol = "TCP"
      port     = 80
      target_port = 8000
    }
    type = "ClusterIP"
  }
}

# Python SDK
resource "kubernetes_deployment" "sdk" {
  metadata {
    name      = "sdk"
    namespace = var.namespace
    labels = {
      app = "sdk"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "sdk"
      }
    }
    template {
      metadata {
        labels = {
          app = "sdk"
        }
      }
      spec {
        container {
          name  = "sdk"
          image = var.image_sdk

          port {
            container_port = 5000
          }

          env {
            name  = "API_URL"
            value = "http://${local.services.api}.${var.namespace}.svc.cluster.local:80"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "sdk" {
  metadata {
    name      = local.services.sdk
    namespace = var.namespace
    labels = {
      app = "sdk"
    }
  }
  spec {
    selector = {
      app = "sdk"
    }
    port {
      protocol = "TCP"
      port     = 80
      target_port = 5000
    }
    type = "ClusterIP"
  }
}

# Engine Core
resource "kubernetes_deployment" "core_engine" {
  metadata {
    name      = "core-engine"
    namespace = var.namespace
    labels = {
      app = "core-engine"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "core-engine"
      }
    }
    template {
      metadata {
        labels = {
          app = "core-engine"
        }
      }
      spec {
        container {
          name  = "core-engine"
          image = var.image_core_engine

          port {
            container_port = 9000
          }

          env {
            name  = "POSTGRES_HOST"
            value = "${local.services.db}.${var.namespace}.svc.cluster.local"
          }

          env {
            name  = "REDIS_HOST"
            value = "${local.services.cache}.${var.namespace}.svc.cluster.local"
          }

          env {
            name  = "GUARDRAILS_RUNTIME_HOST"
            value = "${local.services.guardrails_runtime}.${var.namespace}.svc.cluster.local"
          }

          env {
            name  = "API_URL"
            value = "http://${local.services.api}.${var.namespace}.svc.cluster.local:80"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "core_engine" {
  metadata {
    name      = local.services.core_engine
    namespace = var.namespace
    labels = {
      app = "core-engine"
    }
  }
  spec {
    selector = {
      app = "core-engine"
    }
    port {
      protocol = "TCP"
      port     = 80
      target_port = 9000
    }
    type = "ClusterIP"
  }
}

# Scheduler
resource "kubernetes_deployment" "scheduler" {
  metadata {
    name      = "scheduler"
    namespace = var.namespace
    labels = {
      app = "scheduler"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "scheduler"
      }
    }
    template {
      metadata {
        labels = {
          app = "scheduler"
        }
      }
      spec {
        container {
          name  = "scheduler"
          image = var.image_scheduler

          port {
            container_port = 8001
          }

          env {
            name  = "CORE_ENGINE_HOST"
            value = "${local.services.core_engine}.${var.namespace}.svc.cluster.local"
          }

          env {
            name  = "REDIS_HOST"
            value = "${local.services.cache}.${var.namespace}.svc.cluster.local"
          }

          env {
            name  = "DB_HOST"
            value = "${local.services.db}.${var.namespace}.svc.cluster.local"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "scheduler" {
  metadata {
    name      = local.services.scheduler
    namespace = var.namespace
    labels = {
      app = "scheduler"
    }
  }
  spec {
    selector = {
      app = "scheduler"
    }
    port {
      protocol = "TCP"
      port     = 80
      target_port = 8001
    }
    type = "ClusterIP"
  }
}

# Redis Cache
resource "kubernetes_deployment" "cache" {
  metadata {
    name      = "cache"
    namespace = var.namespace
    labels = {
      app = "cache"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "cache"
      }
    }
    template {
      metadata {
        labels = {
          app = "cache"
        }
      }
      spec {
        container {
          name  = "cache"
          image = var.image_cache

          port {
            container_port = 6379
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "cache" {
  metadata {
    name      = local.services.cache
    namespace = var.namespace
    labels = {
      app = "cache"
    }
  }
  spec {
    selector = {
      app = "cache"
    }
    port {
      protocol = "TCP"
      port     = 80
      target_port = 6379
    }
    type = "ClusterIP"
  }
}

# OpenGuardrails Runtime
resource "kubernetes_deployment" "guardrails_runtime" {
  metadata {
    name      = "guardrails-runtime"
    namespace = var.namespace
    labels = {
      app = "guardrails-runtime"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "guardrails-runtime"
      }
    }
    template {
      metadata {
        labels = {
          app = "guardrails-runtime"
        }
      }
      spec {
        container {
          name  = "guardrails-runtime"
          image = var.image_guardrails_runtime

          port {
            container_port = 9100
          }

          env {
            name  = "API_URL"
            value = "http://${local.services.api}.${var.namespace}.svc.cluster.local:80"
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "guardrails_runtime" {
  metadata {
    name      = local.services.guardrails_runtime
    namespace = var.namespace
    labels = {
      app = "guardrails-runtime"
    }
  }
  spec {
    selector = {
      app = "guardrails-runtime"
    }
    port {
      protocol = "TCP"
      port     = 80
      target_port = 9100
    }
    type = "ClusterIP"
  }
}

# PostgreSQL
resource "kubernetes_deployment" "db" {
  metadata {
    name      = "db"
    namespace = var.namespace
    labels = {
      app = "db"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "db"
      }
    }
    template {
      metadata {
        labels = {
          app = "db"
        }
      }
      spec {
        container {
          name  = "db"
          image = var.image_db

          env {
            name  = "POSTGRES_PASSWORD"
            value = "change-me"
          }

          env {
            name  = "POSTGRES_DB"
            value = "drpe"
          }

          env {
            name  = "POSTGRES_USER"
            value = "drpe"
          }

          port {
            container_port = 5432
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "db" {
  metadata {
    name      = local.services.db
    namespace = var.namespace
    labels = {
      app = "db"
    }
  }
  spec {
    selector = {
      app = "db"
    }
    port {
      protocol = "TCP"
      port     = 80
      target_port = 5432
    }
    type = "ClusterIP"
  }
}
