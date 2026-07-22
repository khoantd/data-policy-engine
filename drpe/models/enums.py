"""Shared enumerations for DRPE policies and evaluations."""

from enum import Enum


class PolicyStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    DEPRECATED = "deprecated"
    ARCHIVED = "archived"


class PolicyKind(str, Enum):
    RETENTION = "retention"
    CLASSIFICATION = "classification"


class DataClassification(str, Enum):
    PII = "PII"
    SPII = "SPII"
    FINANCIAL = "financial"
    OPERATIONAL = "operational"
    PUBLIC = "public"


class Sensitivity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ClassificationAction(str, Enum):
    FLAG = "flag"
    MASK = "mask"
    BLOCK = "block"
    REVIEW = "review"
    ALLOW = "allow"


class Operator(str, Enum):
    EQ = "eq"
    NEQ = "neq"
    GT = "gt"
    GTE = "gte"
    LT = "lt"
    LTE = "lte"
    IN = "in"
    NOT_IN = "not_in"
    CONTAINS = "contains"
    OLDER_THAN = "older_than"
    NEWER_THAN = "newer_than"
    IS_NULL = "is_null"
    REGEX = "regex"


class Action(str, Enum):
    RETAIN = "retain"
    ARCHIVE = "archive"
    ANONYMIZE = "anonymize"
    PSEUDONYMIZE = "pseudonymize"
    DELETE = "delete"
    NOTIFY = "notify"
    FLAG = "flag"


class Confidence(str, Enum):
    DEFINITIVE = "definitive"
    PARTIAL = "partial"
    NONE = "none"
