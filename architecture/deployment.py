from diagrams import Diagram, Cluster
from diagrams.c4 import Container, Database, SystemBoundary, Person, System, Relationship

with Diagram("Data Policy Engine Deployment", show=False, filename="deployment", direction="TB"):

    # Actors
    admin = Person("Policy Admin")
    dpo = Person("DPO / Compliance")

    # External systems
    externalApps = System("Integrating Apps")
    externalLLM = System("LiteLLM")
    externalOGR = System("OpenGuardrails")
    externalHooks = System("Downstream Webhooks")

    # Deployment environment
    with Cluster("Environment: prod") as prod:
        with Cluster("Region: eu-west-1") as euWest1:
            with Cluster("Kubernetes Cluster") as k8s:

                # Runtime components
                adminConsole = Container("Admin Console")
                api = Container("REST API")
                sdk = Container("Python SDK")
                coreEngine = Container("Engine Core")
                scheduler = Container("Scheduler")
                cache = Container("Redis Cache + Broker")
                guardrailsRuntime = Container("OpenGuardrails Runtime")
                db = Database("PostgreSQL")

                # System boundary node for logical grouping
                drpeSystem = System("ROS Policy System")

                # Internal relationships
                api >> Relationship("In-process") >> coreEngine
                api >> Relationship("SQLAlchemy") >> db
                api >> Relationship("Optional Caching") >> cache
                coreEngine >> Relationship("Runtime Adapter") >> guardrailsRuntime
                scheduler >> Relationship("Enforcement Runner") >> coreEngine
                scheduler >> Relationship("Jobs + audit") >> db
                scheduler >> Relationship("Broker / backend") >> cache
                coreEngine >> Relationship("Read/Write audit logs") >> db

                # External interactions
                admin >> Relationship("Accesses") >> adminConsole
                admin >> Relationship("Calls") >> api
                dpo >> Relationship("Audit/DSAR") >> drpeSystem
                externalApps >> Relationship("Uses API") >> api
                externalLLM >> Relationship("Provides AI") >> drpeSystem
                externalOGR >> Relationship("Guardrails Evaluation") >> drpeSystem
                externalHooks >> Relationship("Receives Actions") >> drpeSystem
                drpeSystem >> Relationship("Contains") >> coreEngine
                drpeSystem >> Relationship("Contains") >> api
                drpeSystem >> Relationship("Contains") >> adminConsole
                drpeSystem >> Relationship("Contains") >> sdk
                drpeSystem >> Relationship("Contains") >> scheduler
                drpeSystem >> Relationship("Contains") >> cache
                drpeSystem >> Relationship("Contains") >> guardrailsRuntime
                drpeSystem >> Relationship("Contains") >> db
