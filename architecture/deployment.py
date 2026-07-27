from diagrams import Diagram, Cluster
from diagrams.aws.compute import ECS, EKS
from diagrams.aws.network import VPC, ALB
from diagrams.aws.mobile import APIGateway
from diagrams.aws.database import RDS, ElastiCache
from diagrams.aws.security import IAM
from diagrams.aws.general import Users, Client

with Diagram("Data Policy Engine Deployment", show=False, filename="deployment", direction="TB"):
    # VPC and security
    vpc = VPC("VPC")
    iam = IAM("IAM Roles")

    # External actors
    admin = Users("Policy Admin")
    dpo = Users("DPO / Compliance")
    external_apps = Users("External Apps")
    external_llm = Client("LiteLLM")
    external_ogr = Client("OpenGuardrails")
    external_hooks = Client("Webhooks")

    # Gateway and load balancer
    api_gateway = APIGateway("API Gateway")
    alb = ALB("ALB")

    # Kubernetes cluster
    eks_cluster = EKS("EKS Cluster")

    # Connect external actors to API entry
    admin >> api_gateway
    dpo >> api_gateway
    external_apps >> api_gateway
    api_gateway >> alb >> eks_cluster

    # Connect cluster and services inside VPC
    vpc >> eks_cluster
    vpc >> iam
    vpc >> RDS("PostgreSQL")
    vpc >> ElastiCache("Redis")

    # Services deployed in the EKS cluster
    with Cluster("EKS Cluster"):
        admin_console = ECS("Admin Console")
        api = ECS("API")
        core_engine = ECS("Engine Core")
        scheduler = ECS("Scheduler")
        guardrails_runtime = ECS("Guardrails Runtime")
        cache = ElastiCache("Redis")
        db = RDS("PostgreSQL")

    # IAM to services
    iam >> admin_console
    iam >> api
    iam >> core_engine
    iam >> scheduler
    iam >> guardrails_runtime
    iam >> cache
    iam >> db

    # Internal service communication
    api >> core_engine
    core_engine >> db
    core_engine >> guardrails_runtime
    api >> cache
    scheduler >> core_engine
    scheduler >> db
    scheduler >> cache

    # External services accessed by API
    api >> external_llm
    api >> external_ogr
    api >> external_hooks
