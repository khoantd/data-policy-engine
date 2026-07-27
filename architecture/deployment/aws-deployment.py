from diagrams import Diagram, Cluster
from diagrams.aws.compute import ECS, EKS
from diagrams.aws.database import RDS, ElastiCache
from diagrams.aws.network import VPC, ALB
from diagrams.aws.mobile import APIGateway
from diagrams.aws.security import IAM
from diagrams.aws.general import Users, Client

with Diagram("Data Policy Engine Deployment", show=False, filename="aws-deployment", direction="TB"):

    # External actors
    admin_user = Users("Policy Admin")
    dpo_user = Users("DPO / Compliance")
    external_app = Client("CRM / ERP")
    external_llm = Client("LiteLLM")
    external_ogr = Client("OpenGuardrails")
    external_hooks = Client("Webhooks")

    # IAM role for DRPE
    drpe_iam = IAM("DRPE IAM")

    # Production VPC and EKS cluster
    with Cluster("eu-west-1 VPC") as vpc:
        with Cluster("EKS Cluster") as eks:
            with Cluster("ROS Policy") as drpe:
                # Backend services
                admin_console = ECS("Admin Console")
                api_gateway = APIGateway("API Gateway")
                api_service = ECS("REST API")
                sdk_service = ECS("Python SDK")
                core_engine = ECS("Engine Core")
                scheduler = ECS("Scheduler")
                guardrails_runtime = ECS("Guardrails Runtime")
                redis_cache = ElastiCache("Redis")
                postgres_db = RDS("PostgreSQL")

    # External to gateway
    admin_user >> api_gateway
    dpo_user >> api_gateway
    external_app >> api_gateway
    external_llm >> api_gateway
    external_ogr >> api_gateway
    external_hooks >> api_gateway

    # Internal flows
    admin_user >> admin_console
    admin_console >> api_service
    api_gateway >> api_service
    sdk_service >> api_service
    sdk_service >> core_engine
    api_service >> core_engine
    api_service >> postgres_db
    api_service >> redis_cache
    core_engine >> guardrails_runtime
    scheduler >> core_engine
    scheduler >> postgres_db
    scheduler >> redis_cache
    guardrails_runtime >> api_service
    api_service >> redis_cache
    core_engine >> redis_cache
    core_engine >> postgres_db
    scheduler >> redis_cache
    scheduler >> postgres_db
    drpe_iam >> admin_console
    drpe_iam >> api_service
    drpe_iam >> scheduler
    drpe_iam >> redis_cache
    drpe_iam >> postgres_db
    drpe_iam >> guardrails_runtime
    drpe_iam >> sdk_service
    drpe_iam >> api_gateway
