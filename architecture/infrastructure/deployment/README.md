# Data Policy Engine – AWS Terraform Setup

This repository contains a Terraform configuration that provisions the core infrastructure
required for the Data Policy Engine (DRPE) on AWS.  
The stack is split into **production** and **staging** environments, each with:

- EKS cluster
- Managed PostgreSQL (RDS) instance
- ElastiCache Redis cluster

## Prerequisites

- [Terraform 1.5+](https://www.terraform.io/downloads) or [OpenTofu 1.6+](https://opentofu.org/)
- AWS credentials with permissions to create EKS, RDS, ElastiCache, IAM, and networking resources

## Quick Start
