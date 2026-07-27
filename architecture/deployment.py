from diagrams import Diagram, Cluster
from diagrams.c4 import Container, Database, System, Person, SystemBoundary, Relationship

with Diagram("Production Deployment Architecture", show=False, filename="deployment", direction="TB"):
    # Actors
    admin = Person("Policy Admin")
    dpo = Person("DPO / Compliance")

    # External Systems
    externalApps = System("Integrating apps")
    externalLLM = System("LiteLLM")
    externalOGR = System("OpenGuardrails")
    externalHooks = System("Downstream webhooks")

    # Core System
    drpe = System("ROS Policy")

    # Deployment Environment
    with SystemBoundary("Environment prod") as prod:
        with SystemBoundary("euWest1") as eu:
            with SystemBoundary("Kubernetes cluster") as cluster:
                adminConsole = Container("Admin Console")
                api = Container("REST API")
                sdk = Container("Python SDK")
                coreEngine = Container("Engine Core")
                scheduler = Container("Scheduler")
                cache = Container("Redis")
                guardrailsRuntime = Container("OpenGuardrails Runtime")
                db = Database("PostgreSQL")

    # Relationships between actors and system
    admin >> Relationship("Admin UI + API key") >> drpe
    dpo >> Relationship("Audit / DSAR / grace holds") >> drpe
    externalApps >> Relationship("SDK or REST /api/v1") >> drpe
    drpe >> Relationship("Admin BFF only (masked prompts)") >> externalLLM
    drpe >> Relationship("Guardrails evaluation when installed") >> externalOGR
    drpe >> Relationship("Action dispatch") >> externalHooks

    # API interactions
    admin >> Relationship("DRPE_API_URL + Bearer key") >> api
    admin >> Relationship("AI suggest / samples") >> externalLLM
    sdk >> Relationship("HTTP") >> api
    sdk >> Relationship("Embedded mode") >> coreEngine
    api >> Relationship("In-process") >> coreEngine
    api >> Relationship("SQLAlchemy") >> db
    api >> Relationship("Optional CachingPolicyStore") >> cache

    # Core Engine interactions
    coreEngine >> Relationship("Optional runtime adapter") >> guardrailsRuntime
    scheduler >> Relationship("EnforcementRunner") >> coreEngine
    scheduler >> Relationship("Jobs + audit") >> db
    scheduler >> Relationship("Broker / backend") >> cache

    # Evaluation flow
    coreEngine >> Relationship("Guardrails evaluation (if enabled)") >> guardrailsRuntime
    guardrailsRuntime >> Relationship("Return verdict") >> api
    api >> Relationship("Cache policy") >> cache

    # Enforcement job flow
    scheduler >> Relationship("Run enforcement job") >> coreEngine
    coreEngine >> Relationship("Read pending jobs") >> db
    coreEngine >> Relationship("Write audit logs") >> db
    coreEngine >> Relationship("Publish job to broker") >> cache
    coreEngine >> Relationship("Consume job queue") >> cache
