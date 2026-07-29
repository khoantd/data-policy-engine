# Data Policy Engine (DRPE) Terraform Deployment

This repository contains a Terraform/TfHCL configuration for deploying the **Data Policy Engine** (DRPE) on AWS. It provisions an ECS Fargate cluster with the following services:

- Admin Console (Next.js)
- REST API (FastAPI)
- Python SDK (embedded mode)
- Engine Core (Python)
- Scheduler (Celery)
- Guardrails Runtime (OpenGuardrails)
- Redis (ElastiCache)
- PostgreSQL (RDS)

## Prerequisites

- AWS account with permission to create IAM roles, ECS, RDS, ElastiCache, and VPC resources.
- Terraform 1.5+ or OpenTofu 1.6+ installed.
- Docker images for each service pushed to ECR or another registry.
- Secrets stored in AWS Secrets Manager for DB and Redis credentials.

## Variables

| Variable | Description | Type | Default |
|----------|-------------|------|---------|
| `region` | AWS region | string | – |
| `environment` | Deployment environment (prod, staging) | string | `prod` |
| `vpc_id` | ID of the VPC to deploy into | string | – |
| `subnet_ids` | List of subnet IDs for the cluster | list(string) | – |
| `db_username` | PostgreSQL username | string | – |
| `db_password_secret_arn` | ARN of Secrets Manager secret for DB password | string | – |
| `cache_password_secret_arn` | ARN of Secrets Manager secret for Redis password | string | – |
| `image_admin_console` | ECR image URI for Admin Console | string | – |
| `image_api` | ECR image URI for REST API | string | – |
| `image_sdk` | ECR image URI for Python SDK | string | – |
| `image_core_engine` | ECR image URI for Engine Core | string | – |
| `image_scheduler` | ECR image URI for Scheduler | string | – |
| `image_guardrails_runtime` | ECR image URI for Guardrails Runtime | string | – |
| `image_cache` | ECR image URI for Redis (optional) | string | – |
| `db_name` | PostgreSQL database name | string | `drpe` |
| `cache_cluster_name` | Name of the Redis cluster | string | `drpe-redis` |

## Usage
