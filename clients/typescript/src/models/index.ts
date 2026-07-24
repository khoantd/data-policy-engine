/* tslint:disable */
/* eslint-disable */

/**
 * 
 * @export
 */
export const Action = {
    Retain: 'retain',
    Archive: 'archive',
    Anonymize: 'anonymize',
    Pseudonymize: 'pseudonymize',
    Delete: 'delete',
    Notify: 'notify',
    Flag: 'flag'
} as const;
export type Action = typeof Action[keyof typeof Action];

/**
 * 
 * @export
 * @interface AuditConfig
 */
export interface AuditConfig {
    /**
     * 
     * @type {boolean}
     * @memberof AuditConfig
     */
    logEvaluations?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof AuditConfig
     */
    logActions?: boolean;
    /**
     * 
     * @type {string}
     * @memberof AuditConfig
     */
    retentionOfAuditLogs?: string | null;
}
/**
 * Immutable audit log entry.
 * @export
 * @interface AuditEntry
 */
export interface AuditEntry {
    /**
     * 
     * @type {string}
     * @memberof AuditEntry
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof AuditEntry
     */
    createdAt: string;
    /**
     * 
     * @type {AuditEventType}
     * @memberof AuditEntry
     */
    eventType: AuditEventType;
    /**
     * 
     * @type {string}
     * @memberof AuditEntry
     */
    policyId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AuditEntry
     */
    ruleId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AuditEntry
     */
    recordId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AuditEntry
     */
    action?: string | null;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof AuditEntry
     */
    payload?: { [key: string]: any; };
    /**
     * 
     * @type {string}
     * @memberof AuditEntry
     */
    jobId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AuditEntry
     */
    evaluationId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof AuditEntry
     */
    requester?: string | null;
}



/**
 * 
 * @export
 */
export const AuditEventType = {
    Evaluation: 'evaluation',
    Action: 'action',
    Notify: 'notify',
    PendingGrace: 'pending_grace',
    Flag: 'flag',
    DsarAccess: 'dsar_access',
    DsarErasure: 'dsar_erasure',
    GraceCancelled: 'grace_cancelled'
} as const;
export type AuditEventType = typeof AuditEventType[keyof typeof AuditEventType];

/**
 * 
 * @export
 * @interface BatchClassificationRequest
 */
export interface BatchClassificationRequest {
    /**
     * 
     * @type {Array<ClassificationRequest>}
     * @memberof BatchClassificationRequest
     */
    records: Array<ClassificationRequest>;
}
/**
 * 
 * @export
 * @interface BatchEvaluateRequest
 */
export interface BatchEvaluateRequest {
    /**
     * 
     * @type {Array<EvaluationRequest>}
     * @memberof BatchEvaluateRequest
     */
    records: Array<EvaluationRequest>;
}

/**
 * 
 * @export
 */
export const ClassificationAction = {
    Flag: 'flag',
    Mask: 'mask',
    Block: 'block',
    Review: 'review',
    Allow: 'allow'
} as const;
export type ClassificationAction = typeof ClassificationAction[keyof typeof ClassificationAction];

/**
 * Why a policy did or did not apply to this request.
 * @export
 * @interface ClassificationDiagnostics
 */
export interface ClassificationDiagnostics {
    /**
     * 
     * @type {number}
     * @memberof ClassificationDiagnostics
     */
    applicablePolicyCount?: number;
    /**
     * 
     * @type {boolean}
     * @memberof ClassificationDiagnostics
     */
    selectedPolicyApplied?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ClassificationDiagnostics
     */
    outOfScopeReason?: ClassificationDiagnosticsOutOfScopeReasonEnum;
    /**
     * 
     * @type {ClassificationPolicyScopeSummary}
     * @memberof ClassificationDiagnostics
     */
    policyScopeSummary?: ClassificationPolicyScopeSummary | null;
}


/**
 * @export
 */
export const ClassificationDiagnosticsOutOfScopeReasonEnum = {
    None: 'none',
    Jurisdiction: 'jurisdiction',
    DataType: 'data_type',
    Source: 'source'
} as const;
export type ClassificationDiagnosticsOutOfScopeReasonEnum = typeof ClassificationDiagnosticsOutOfScopeReasonEnum[keyof typeof ClassificationDiagnosticsOutOfScopeReasonEnum];

/**
 * A detectable PII / sensitive data entity definition.
 * @export
 * @interface ClassificationEntity
 */
export interface ClassificationEntity {
    /**
     * 
     * @type {string}
     * @memberof ClassificationEntity
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof ClassificationEntity
     */
    label: string;
    /**
     * 
     * @type {DataClassification}
     * @memberof ClassificationEntity
     */
    classification: DataClassification;
    /**
     * 
     * @type {Sensitivity}
     * @memberof ClassificationEntity
     */
    sensitivity?: Sensitivity;
    /**
     * 
     * @type {Array<string>}
     * @memberof ClassificationEntity
     */
    regulatoryRefs?: Array<string>;
    /**
     * 
     * @type {EntityDetection}
     * @memberof ClassificationEntity
     */
    detection?: EntityDetection;
}


/**
 * Full classification policy definition.
 * @export
 * @interface ClassificationPolicy
 */
export interface ClassificationPolicy {
    /**
     * 
     * @type {string}
     * @memberof ClassificationPolicy
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof ClassificationPolicy
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof ClassificationPolicy
     */
    version?: number;
    /**
     * 
     * @type {PolicyStatus}
     * @memberof ClassificationPolicy
     */
    status?: PolicyStatus;
    /**
     * 
     * @type {string}
     * @memberof ClassificationPolicy
     */
    jurisdiction: string;
    /**
     * 
     * @type {PolicyKind}
     * @memberof ClassificationPolicy
     */
    policyKind?: PolicyKind;
    /**
     * 
     * @type {string}
     * @memberof ClassificationPolicy
     */
    owner?: string | null;
    /**
     * 
     * @type {EffectiveFrom}
     * @memberof ClassificationPolicy
     */
    effectiveFrom?: EffectiveFrom | null;
    /**
     * 
     * @type {ExpiresAt}
     * @memberof ClassificationPolicy
     */
    expiresAt?: ExpiresAt | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof ClassificationPolicy
     */
    tags?: Array<string>;
    /**
     * 
     * @type {PolicyScope}
     * @memberof ClassificationPolicy
     */
    scope?: PolicyScope;
    /**
     * 
     * @type {Array<ClassificationEntity>}
     * @memberof ClassificationPolicy
     */
    entities: Array<ClassificationEntity>;
    /**
     * 
     * @type {Array<ClassificationRule>}
     * @memberof ClassificationPolicy
     */
    rules: Array<ClassificationRule>;
    /**
     * Metadata field paths scanned with NER when privalyse is available
     * @type {Array<string>}
     * @memberof ClassificationPolicy
     */
    textFields?: Array<string>;
    /**
     * 
     * @type {Array<ReferenceSource>}
     * @memberof ClassificationPolicy
     */
    referenceSources?: Array<ReferenceSource>;
}


/**
 * Subset of selected policy scope echoed for UI diagnostics.
 * @export
 * @interface ClassificationPolicyScopeSummary
 */
export interface ClassificationPolicyScopeSummary {
    /**
     * 
     * @type {string}
     * @memberof ClassificationPolicyScopeSummary
     */
    jurisdiction: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ClassificationPolicyScopeSummary
     */
    dataTypes?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ClassificationPolicyScopeSummary
     */
    sources?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ClassificationPolicyScopeSummary
     */
    excludedDataTypes?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ClassificationPolicyScopeSummary
     */
    excludedSources?: Array<string>;
}
/**
 * Request to classify a record against classification policies.
 * @export
 * @interface ClassificationRequest
 */
export interface ClassificationRequest {
    /**
     * 
     * @type {string}
     * @memberof ClassificationRequest
     */
    dataType: string;
    /**
     * 
     * @type {string}
     * @memberof ClassificationRequest
     */
    recordId: string;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof ClassificationRequest
     */
    metadata?: { [key: string]: any; };
    /**
     * 
     * @type {string}
     * @memberof ClassificationRequest
     */
    source?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ClassificationRequest
     */
    jurisdiction?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof ClassificationRequest
     */
    textFields?: Array<string> | null;
    /**
     * 
     * @type {string}
     * @memberof ClassificationRequest
     */
    policyId?: string | null;
}
/**
 * 
 * @export
 * @interface ClassificationResponse
 */
export interface ClassificationResponse {
    /**
     * 
     * @type {string}
     * @memberof ClassificationResponse
     */
    recordId: string;
    /**
     * 
     * @type {string}
     * @memberof ClassificationResponse
     */
    classificationId: string;
    /**
     * 
     * @type {Array<DetectedEntity>}
     * @memberof ClassificationResponse
     */
    detectedEntities?: Array<DetectedEntity>;
    /**
     * 
     * @type {ClassificationResultDetail}
     * @memberof ClassificationResponse
     */
    result: ClassificationResultDetail;
    /**
     * 
     * @type {ClassificationDiagnostics}
     * @memberof ClassificationResponse
     */
    diagnostics?: ClassificationDiagnostics;
    /**
     * 
     * @type {string}
     * @memberof ClassificationResponse
     */
    jurisdictionApplied?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ClassificationResponse
     */
    classifiedAt: string;
    /**
     * 
     * @type {string}
     * @memberof ClassificationResponse
     */
    auditRef?: string | null;
}
/**
 * 
 * @export
 * @interface ClassificationResultDetail
 */
export interface ClassificationResultDetail {
    /**
     * 
     * @type {ClassificationAction}
     * @memberof ClassificationResultDetail
     */
    action: ClassificationAction;
    /**
     * 
     * @type {string}
     * @memberof ClassificationResultDetail
     */
    handling?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ClassificationResultDetail
     */
    matchedPolicy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ClassificationResultDetail
     */
    matchedRule?: string | null;
    /**
     * 
     * @type {number}
     * @memberof ClassificationResultDetail
     */
    policyVersion?: number | null;
    /**
     * 
     * @type {DataClassification}
     * @memberof ClassificationResultDetail
     */
    maxClassification?: DataClassification | null;
    /**
     * 
     * @type {Sensitivity}
     * @memberof ClassificationResultDetail
     */
    maxSensitivity?: Sensitivity | null;
}


/**
 * Rule fired after entity detection to recommend handling.
 * @export
 * @interface ClassificationRule
 */
export interface ClassificationRule {
    /**
     * 
     * @type {string}
     * @memberof ClassificationRule
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof ClassificationRule
     */
    description?: string | null;
    /**
     * 
     * @type {number}
     * @memberof ClassificationRule
     */
    priority: number;
    /**
     * 
     * @type {ConditionGroup}
     * @memberof ClassificationRule
     */
    condition: ConditionGroup;
    /**
     * 
     * @type {ClassificationAction}
     * @memberof ClassificationRule
     */
    action: ClassificationAction;
    /**
     * 
     * @type {string}
     * @memberof ClassificationRule
     */
    handling?: string | null;
}


/**
 * Compound condition: all (AND) or any (OR) of field conditions.
 * @export
 * @interface ConditionGroup
 */
export interface ConditionGroup {
    /**
     * 
     * @type {Array<FieldCondition>}
     * @memberof ConditionGroup
     */
    all?: Array<FieldCondition> | null;
    /**
     * 
     * @type {Array<FieldCondition>}
     * @memberof ConditionGroup
     */
    any?: Array<FieldCondition> | null;
}
/**
 * 
 * @export
 * @interface ConflictingPolicy
 */
export interface ConflictingPolicy {
    /**
     * 
     * @type {string}
     * @memberof ConflictingPolicy
     */
    policyId: string;
    /**
     * 
     * @type {string}
     * @memberof ConflictingPolicy
     */
    ruleId: string;
    /**
     * 
     * @type {Action}
     * @memberof ConflictingPolicy
     */
    action: Action;
    /**
     * 
     * @type {number}
     * @memberof ConflictingPolicy
     */
    priority: number;
}



/**
 * 
 * @export
 */
export const DataClassification = {
    Pii: 'PII',
    Spii: 'SPII',
    Financial: 'financial',
    Operational: 'operational',
    Public: 'public'
} as const;
export type DataClassification = typeof DataClassification[keyof typeof DataClassification];

/**
 * A single entity hit from classification.
 * @export
 * @interface DetectedEntity
 */
export interface DetectedEntity {
    /**
     * 
     * @type {string}
     * @memberof DetectedEntity
     */
    entityId: string;
    /**
     * 
     * @type {string}
     * @memberof DetectedEntity
     */
    label: string;
    /**
     * 
     * @type {string}
     * @memberof DetectedEntity
     */
    field: string;
    /**
     * 
     * @type {DataClassification}
     * @memberof DetectedEntity
     */
    classification: DataClassification;
    /**
     * 
     * @type {Sensitivity}
     * @memberof DetectedEntity
     */
    sensitivity: Sensitivity;
    /**
     * 
     * @type {string}
     * @memberof DetectedEntity
     */
    confidence?: string;
    /**
     * 
     * @type {string}
     * @memberof DetectedEntity
     */
    snippet?: string | null;
    /**
     * 
     * @type {string}
     * @memberof DetectedEntity
     */
    detector: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof DetectedEntity
     */
    regulatoryRefs?: Array<string>;
}


/**
 * 
 * @export
 * @interface DsarConfig
 */
export interface DsarConfig {
    /**
     * 
     * @type {boolean}
     * @memberof DsarConfig
     */
    rightToAccess?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof DsarConfig
     */
    rightToErasure?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof DsarConfig
     */
    erasureExceptions?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof DsarConfig
     */
    responseDeadline?: string | null;
}
/**
 * 
 * @export
 * @interface DsarDeniedRecord
 */
export interface DsarDeniedRecord {
    /**
     * 
     * @type {string}
     * @memberof DsarDeniedRecord
     */
    recordId: string;
    /**
     * 
     * @type {string}
     * @memberof DsarDeniedRecord
     */
    reason: string;
}
/**
 * 
 * @export
 * @interface DsarError
 */
export interface DsarError {
    /**
     * 
     * @type {string}
     * @memberof DsarError
     */
    recordId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof DsarError
     */
    detail: string;
}
/**
 * 
 * @export
 * @interface DsarRequest
 */
export interface DsarRequest {
    /**
     * 
     * @type {string}
     * @memberof DsarRequest
     */
    id: string;
    /**
     * 
     * @type {DsarRequestType}
     * @memberof DsarRequest
     */
    type: DsarRequestType;
    /**
     * 
     * @type {DsarRequestStatus}
     * @memberof DsarRequest
     */
    status?: DsarRequestStatus;
    /**
     * 
     * @type {string}
     * @memberof DsarRequest
     */
    subjectId: string;
    /**
     * 
     * @type {string}
     * @memberof DsarRequest
     */
    policyId: string;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof DsarRequest
     */
    identity?: { [key: string]: any; } | null;
    /**
     * 
     * @type {string}
     * @memberof DsarRequest
     */
    requestedAt: string;
    /**
     * 
     * @type {string}
     * @memberof DsarRequest
     */
    dueAt?: string | null;
    /**
     * 
     * @type {string}
     * @memberof DsarRequest
     */
    completedAt?: string | null;
    /**
     * 
     * @type {Array<RecordRef>}
     * @memberof DsarRequest
     */
    inlineRecords?: Array<RecordRef> | null;
    /**
     * 
     * @type {DsarResult}
     * @memberof DsarRequest
     */
    result?: DsarResult;
    /**
     * 
     * @type {string}
     * @memberof DsarRequest
     */
    error?: string | null;
}



/**
 * 
 * @export
 */
export const DsarRequestStatus = {
    Received: 'received',
    InProgress: 'in_progress',
    Completed: 'completed',
    Partial: 'partial',
    Denied: 'denied',
    Failed: 'failed'
} as const;
export type DsarRequestStatus = typeof DsarRequestStatus[keyof typeof DsarRequestStatus];


/**
 * 
 * @export
 */
export const DsarRequestType = {
    Access: 'access',
    Erasure: 'erasure'
} as const;
export type DsarRequestType = typeof DsarRequestType[keyof typeof DsarRequestType];

/**
 * Outcome payload stored on a DSAR request after processing.
 * @export
 * @interface DsarResult
 */
export interface DsarResult {
    /**
     * 
     * @type {Array<RecordRef>}
     * @memberof DsarResult
     */
    records?: Array<RecordRef>;
    /**
     * 
     * @type {Array<string>}
     * @memberof DsarResult
     */
    erased?: Array<string>;
    /**
     * 
     * @type {Array<DsarDeniedRecord>}
     * @memberof DsarResult
     */
    denied?: Array<DsarDeniedRecord>;
    /**
     * 
     * @type {Array<DsarError>}
     * @memberof DsarResult
     */
    errors?: Array<DsarError>;
}
/**
 * POST /api/v1/dsar/access|erasure body.
 * @export
 * @interface DsarSubmitRequest
 */
export interface DsarSubmitRequest {
    /**
     * 
     * @type {string}
     * @memberof DsarSubmitRequest
     */
    subjectId: string;
    /**
     * 
     * @type {string}
     * @memberof DsarSubmitRequest
     */
    policyId: string;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof DsarSubmitRequest
     */
    identity?: { [key: string]: any; } | null;
    /**
     * 
     * @type {Array<RecordRef>}
     * @memberof DsarSubmitRequest
     */
    records?: Array<RecordRef> | null;
}
/**
 * 
 * @export
 * @interface EffectiveFrom
 */
export interface EffectiveFrom {
}
/**
 * POST /api/v1/enforce body.
 * @export
 * @interface EnforceRequest
 */
export interface EnforceRequest {
    /**
     * 
     * @type {string}
     * @memberof EnforceRequest
     */
    policyId?: string | null;
    /**
     * 
     * @type {Array<RecordRef>}
     * @memberof EnforceRequest
     */
    records?: Array<RecordRef> | null;
}
/**
 * 
 * @export
 * @interface EnforceResponse
 */
export interface EnforceResponse {
    /**
     * 
     * @type {string}
     * @memberof EnforceResponse
     */
    jobId: string;
    /**
     * 
     * @type {JobStatus}
     * @memberof EnforceResponse
     */
    status: JobStatus;
}


/**
 * 
 * @export
 * @interface EnforcementJob
 */
export interface EnforcementJob {
    /**
     * 
     * @type {string}
     * @memberof EnforcementJob
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof EnforcementJob
     */
    policyId?: string | null;
    /**
     * 
     * @type {JobStatus}
     * @memberof EnforcementJob
     */
    status?: JobStatus;
    /**
     * 
     * @type {JobTrigger}
     * @memberof EnforcementJob
     */
    trigger?: JobTrigger;
    /**
     * 
     * @type {string}
     * @memberof EnforcementJob
     */
    requestedAt: string;
    /**
     * 
     * @type {string}
     * @memberof EnforcementJob
     */
    startedAt?: string | null;
    /**
     * 
     * @type {string}
     * @memberof EnforcementJob
     */
    finishedAt?: string | null;
    /**
     * 
     * @type {JobProgress}
     * @memberof EnforcementJob
     */
    progress?: JobProgress;
    /**
     * 
     * @type {string}
     * @memberof EnforcementJob
     */
    error?: string | null;
    /**
     * 
     * @type {Array<RecordRef>}
     * @memberof EnforcementJob
     */
    inlineRecords?: Array<RecordRef> | null;
}


/**
 * How to detect an entity in record metadata or text.
 * @export
 * @interface EntityDetection
 */
export interface EntityDetection {
    /**
     * 
     * @type {Array<string>}
     * @memberof EntityDetection
     */
    fieldNames?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof EntityDetection
     */
    regex?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof EntityDetection
     */
    nerTypes?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof EntityDetection
     */
    catalogRef?: string | null;
}
/**
 * Request to evaluate a record against policies.
 * @export
 * @interface EvaluationRequest
 */
export interface EvaluationRequest {
    /**
     * 
     * @type {string}
     * @memberof EvaluationRequest
     */
    dataType: string;
    /**
     * 
     * @type {string}
     * @memberof EvaluationRequest
     */
    recordId: string;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof EvaluationRequest
     */
    metadata?: { [key: string]: any; };
    /**
     * 
     * @type {string}
     * @memberof EvaluationRequest
     */
    source?: string | null;
    /**
     * 
     * @type {string}
     * @memberof EvaluationRequest
     */
    jurisdiction?: string | null;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof EvaluationRequest
     */
    context?: { [key: string]: any; } | null;
}
/**
 * Full evaluation response (API + SDK).
 * @export
 * @interface EvaluationResponse
 */
export interface EvaluationResponse {
    /**
     * 
     * @type {string}
     * @memberof EvaluationResponse
     */
    recordId: string;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResponse
     */
    evaluationId: string;
    /**
     * 
     * @type {EvaluationResultDetail}
     * @memberof EvaluationResponse
     */
    result: EvaluationResultDetail;
    /**
     * 
     * @type {Array<ConflictingPolicy>}
     * @memberof EvaluationResponse
     */
    conflictingPolicies?: Array<ConflictingPolicy>;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResponse
     */
    jurisdictionApplied?: string | null;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResponse
     */
    evaluatedAt: string;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResponse
     */
    auditRef?: string | null;
}
/**
 * 
 * @export
 * @interface EvaluationResultDetail
 */
export interface EvaluationResultDetail {
    /**
     * 
     * @type {Action}
     * @memberof EvaluationResultDetail
     */
    action: Action;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResultDetail
     */
    matchedPolicy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResultDetail
     */
    matchedRule?: string | null;
    /**
     * 
     * @type {number}
     * @memberof EvaluationResultDetail
     */
    policyVersion?: number | null;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResultDetail
     */
    gracePeriodEnds?: string | null;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResultDetail
     */
    notifyAt?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof EvaluationResultDetail
     */
    requiresApproval?: boolean;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResultDetail
     */
    confidence?: EvaluationResultDetailConfidenceEnum;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResultDetail
     */
    archiveTarget?: string | null;
    /**
     * 
     * @type {string}
     * @memberof EvaluationResultDetail
     */
    retainUntil?: string | null;
}


/**
 * @export
 */
export const EvaluationResultDetailConfidenceEnum = {
    Definitive: 'definitive',
    Partial: 'partial',
    None: 'none'
} as const;
export type EvaluationResultDetailConfidenceEnum = typeof EvaluationResultDetailConfidenceEnum[keyof typeof EvaluationResultDetailConfidenceEnum];

/**
 * 
 * @export
 * @interface ExpiresAt
 */
export interface ExpiresAt {
}
/**
 * A single field comparison in a rule condition.
 * @export
 * @interface FieldCondition
 */
export interface FieldCondition {
    /**
     * 
     * @type {string}
     * @memberof FieldCondition
     */
    field: string;
    /**
     * 
     * @type {Operator}
     * @memberof FieldCondition
     */
    operator: Operator;
    /**
     * 
     * @type {any}
     * @memberof FieldCondition
     */
    value?: any | null;
}


/**
 * 
 * @export
 * @interface GraceHold
 */
export interface GraceHold {
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    policyId: string;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    ruleId: string;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    recordId: string;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    dataType: string;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    action: string;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    gracePeriodEnds: string;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    notifyAt?: string | null;
    /**
     * 
     * @type {GraceHoldStatus}
     * @memberof GraceHold
     */
    status?: GraceHoldStatus;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    updatedAt: string;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    closedAt?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    requester?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    sourceJobId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GraceHold
     */
    evaluationId?: string | null;
}


/**
 * Optional body for force / cancel.
 * @export
 * @interface GraceHoldActionRequest
 */
export interface GraceHoldActionRequest {
    /**
     * 
     * @type {string}
     * @memberof GraceHoldActionRequest
     */
    requester?: string | null;
}

/**
 * 
 * @export
 */
export const GraceHoldStatus = {
    Active: 'active',
    Dispatched: 'dispatched',
    Forced: 'forced',
    Cancelled: 'cancelled'
} as const;
export type GraceHoldStatus = typeof GraceHoldStatus[keyof typeof GraceHoldStatus];

/**
 * 
 * @export
 * @interface HTTPValidationError
 */
export interface HTTPValidationError {
    /**
     * 
     * @type {Array<ValidationError>}
     * @memberof HTTPValidationError
     */
    detail?: Array<ValidationError>;
}
/**
 * 
 * @export
 * @interface HealthResponse
 */
export interface HealthResponse {
    /**
     * 
     * @type {string}
     * @memberof HealthResponse
     */
    status: string;
    /**
     * 
     * @type {string}
     * @memberof HealthResponse
     */
    version?: string;
}
/**
 * 
 * @export
 * @interface ImportRequest
 */
export interface ImportRequest {
    /**
     * 
     * @type {string}
     * @memberof ImportRequest
     */
    yaml: string;
    /**
     * 
     * @type {Array<ReferenceSource>}
     * @memberof ImportRequest
     */
    referenceSources?: Array<ReferenceSource>;
}
/**
 * 
 * @export
 * @interface ImportResponse
 */
export interface ImportResponse {
    /**
     * 
     * @type {Array<string>}
     * @memberof ImportResponse
     */
    imported: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof ImportResponse
     */
    count: number;
}
/**
 * 
 * @export
 * @interface JobProgress
 */
export interface JobProgress {
    /**
     * 
     * @type {number}
     * @memberof JobProgress
     */
    scanned?: number;
    /**
     * 
     * @type {number}
     * @memberof JobProgress
     */
    dispatched?: number;
    /**
     * 
     * @type {number}
     * @memberof JobProgress
     */
    pendingGrace?: number;
    /**
     * 
     * @type {number}
     * @memberof JobProgress
     */
    errors?: number;
    /**
     * 
     * @type {number}
     * @memberof JobProgress
     */
    notified?: number;
}

/**
 * 
 * @export
 */
export const JobStatus = {
    Queued: 'queued',
    Running: 'running',
    Succeeded: 'succeeded',
    Failed: 'failed',
    Cancelled: 'cancelled'
} as const;
export type JobStatus = typeof JobStatus[keyof typeof JobStatus];


/**
 * 
 * @export
 */
export const JobTrigger = {
    Schedule: 'schedule',
    Api: 'api'
} as const;
export type JobTrigger = typeof JobTrigger[keyof typeof JobTrigger];

/**
 * 
 * @export
 * @interface MaskRequest
 */
export interface MaskRequest {
    /**
     * 
     * @type {string}
     * @memberof MaskRequest
     */
    text?: string | null;
    /**
     * 
     * @type {Array<{ [key: string]: string; }>}
     * @memberof MaskRequest
     */
    messages?: Array<{ [key: string]: string; }> | null;
}
/**
 * 
 * @export
 * @interface MaskResponse
 */
export interface MaskResponse {
    /**
     * 
     * @type {string}
     * @memberof MaskResponse
     */
    maskedText?: string | null;
    /**
     * 
     * @type {Array<{ [key: string]: string; }>}
     * @memberof MaskResponse
     */
    maskedMessages?: Array<{ [key: string]: string; }> | null;
    /**
     * 
     * @type {string}
     * @memberof MaskResponse
     */
    mappingToken: string;
    /**
     * 
     * @type {number}
     * @memberof MaskResponse
     */
    entityCount: number;
}

/**
 * 
 * @export
 */
export const Operator = {
    Eq: 'eq',
    Neq: 'neq',
    Gt: 'gt',
    Gte: 'gte',
    Lt: 'lt',
    Lte: 'lte',
    In: 'in',
    NotIn: 'not_in',
    Contains: 'contains',
    OlderThan: 'older_than',
    NewerThan: 'newer_than',
    IsNull: 'is_null',
    Regex: 'regex'
} as const;
export type Operator = typeof Operator[keyof typeof Operator];

/**
 * Full retention policy definition.
 * @export
 * @interface Policy
 */
export interface Policy {
    /**
     * 
     * @type {string}
     * @memberof Policy
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Policy
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof Policy
     */
    version?: number;
    /**
     * 
     * @type {PolicyStatus}
     * @memberof Policy
     */
    status?: PolicyStatus;
    /**
     * 
     * @type {string}
     * @memberof Policy
     */
    jurisdiction: string;
    /**
     * 
     * @type {PolicyKind}
     * @memberof Policy
     */
    policyKind?: PolicyKind;
    /**
     * 
     * @type {DataClassification}
     * @memberof Policy
     */
    dataClassification: DataClassification;
    /**
     * 
     * @type {string}
     * @memberof Policy
     */
    owner?: string | null;
    /**
     * 
     * @type {EffectiveFrom}
     * @memberof Policy
     */
    effectiveFrom?: EffectiveFrom | null;
    /**
     * 
     * @type {ExpiresAt}
     * @memberof Policy
     */
    expiresAt?: ExpiresAt | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof Policy
     */
    tags?: Array<string>;
    /**
     * 
     * @type {PolicyScope}
     * @memberof Policy
     */
    scope?: PolicyScope;
    /**
     * 
     * @type {Array<PolicyRule>}
     * @memberof Policy
     */
    rules: Array<PolicyRule>;
    /**
     * 
     * @type {DsarConfig}
     * @memberof Policy
     */
    dsar?: DsarConfig | null;
    /**
     * 
     * @type {AuditConfig}
     * @memberof Policy
     */
    audit?: AuditConfig | null;
    /**
     * 
     * @type {Array<ReferenceSource>}
     * @memberof Policy
     */
    referenceSources?: Array<ReferenceSource>;
}


/**
 * Create from YAML string or JSON policy object.
 * @export
 * @interface PolicyCreateRequest
 */
export interface PolicyCreateRequest {
    /**
     * 
     * @type {string}
     * @memberof PolicyCreateRequest
     */
    yaml?: string | null;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof PolicyCreateRequest
     */
    policy?: { [key: string]: any; } | null;
}
/**
 * A single structural change between two policy versions.
 * @export
 * @interface PolicyDiffChange
 */
export interface PolicyDiffChange {
    /**
     * 
     * @type {string}
     * @memberof PolicyDiffChange
     */
    path: string;
    /**
     * 
     * @type {string}
     * @memberof PolicyDiffChange
     */
    op: PolicyDiffChangeOpEnum;
    /**
     * 
     * @type {any}
     * @memberof PolicyDiffChange
     */
    old?: any | null;
    /**
     * 
     * @type {any}
     * @memberof PolicyDiffChange
     */
    _new?: any | null;
}


/**
 * @export
 */
export const PolicyDiffChangeOpEnum = {
    Add: 'add',
    Remove: 'remove',
    Replace: 'replace'
} as const;
export type PolicyDiffChangeOpEnum = typeof PolicyDiffChangeOpEnum[keyof typeof PolicyDiffChangeOpEnum];

/**
 * 
 * @export
 * @interface PolicyDiffRequest
 */
export interface PolicyDiffRequest {
    /**
     * 
     * @type {number}
     * @memberof PolicyDiffRequest
     */
    fromVersion: number;
    /**
     * 
     * @type {number}
     * @memberof PolicyDiffRequest
     */
    toVersion: number;
}
/**
 * 
 * @export
 * @interface PolicyDiffResponse
 */
export interface PolicyDiffResponse {
    /**
     * 
     * @type {string}
     * @memberof PolicyDiffResponse
     */
    policyId: string;
    /**
     * 
     * @type {number}
     * @memberof PolicyDiffResponse
     */
    fromVersion: number;
    /**
     * 
     * @type {number}
     * @memberof PolicyDiffResponse
     */
    toVersion: number;
    /**
     * 
     * @type {Array<PolicyDiffChange>}
     * @memberof PolicyDiffResponse
     */
    changes?: Array<PolicyDiffChange>;
}

/**
 * 
 * @export
 */
export const PolicyKind = {
    Retention: 'retention',
    Classification: 'classification'
} as const;
export type PolicyKind = typeof PolicyKind[keyof typeof PolicyKind];

/**
 * 
 * @export
 * @interface PolicyListItem
 */
export interface PolicyListItem {
    /**
     * 
     * @type {string}
     * @memberof PolicyListItem
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof PolicyListItem
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof PolicyListItem
     */
    version: number;
    /**
     * 
     * @type {PolicyStatus}
     * @memberof PolicyListItem
     */
    status: PolicyStatus;
    /**
     * 
     * @type {string}
     * @memberof PolicyListItem
     */
    jurisdiction: string;
    /**
     * 
     * @type {PolicyKind}
     * @memberof PolicyListItem
     */
    policyKind: PolicyKind;
    /**
     * 
     * @type {string}
     * @memberof PolicyListItem
     */
    dataClassification?: string | null;
    /**
     * 
     * @type {number}
     * @memberof PolicyListItem
     */
    entityCount?: number | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof PolicyListItem
     */
    scopeDataTypes?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof PolicyListItem
     */
    scopeSources?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof PolicyListItem
     */
    excludedDataTypes?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof PolicyListItem
     */
    excludedSources?: Array<string>;
    /**
     * 
     * @type {number}
     * @memberof PolicyListItem
     */
    ruleCount: number;
}


/**
 * A single retention rule within a policy.
 * @export
 * @interface PolicyRule
 */
export interface PolicyRule {
    /**
     * 
     * @type {string}
     * @memberof PolicyRule
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof PolicyRule
     */
    description?: string | null;
    /**
     * 
     * @type {number}
     * @memberof PolicyRule
     */
    priority: number;
    /**
     * 
     * @type {ConditionGroup}
     * @memberof PolicyRule
     */
    condition: ConditionGroup;
    /**
     * 
     * @type {Action}
     * @memberof PolicyRule
     */
    action: Action;
    /**
     * 
     * @type {string}
     * @memberof PolicyRule
     */
    gracePeriod?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PolicyRule
     */
    notifyBefore?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof PolicyRule
     */
    requiresApproval?: boolean;
    /**
     * 
     * @type {string}
     * @memberof PolicyRule
     */
    archiveTarget?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PolicyRule
     */
    retainUntil?: string | null;
}


/**
 * 
 * @export
 * @interface PolicyScope
 */
export interface PolicyScope {
    /**
     * 
     * @type {Array<string>}
     * @memberof PolicyScope
     */
    dataTypes?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof PolicyScope
     */
    sources?: Array<string>;
    /**
     * 
     * @type {ScopeExclude}
     * @memberof PolicyScope
     */
    exclude?: ScopeExclude | null;
}

/**
 * 
 * @export
 */
export const PolicyStatus = {
    Draft: 'draft',
    Active: 'active',
    Deprecated: 'deprecated',
    Archived: 'archived'
} as const;
export type PolicyStatus = typeof PolicyStatus[keyof typeof PolicyStatus];

/**
 * 
 * @export
 * @interface PolicyStatusChangeRequest
 */
export interface PolicyStatusChangeRequest {
    /**
     * 
     * @type {PolicyStatus}
     * @memberof PolicyStatusChangeRequest
     */
    status: PolicyStatus;
}


/**
 * Lightweight metadata for a stored policy version snapshot.
 * @export
 * @interface PolicyVersionInfo
 */
export interface PolicyVersionInfo {
    /**
     * 
     * @type {string}
     * @memberof PolicyVersionInfo
     */
    policyId: string;
    /**
     * 
     * @type {number}
     * @memberof PolicyVersionInfo
     */
    version: number;
    /**
     * 
     * @type {string}
     * @memberof PolicyVersionInfo
     */
    createdAt?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PolicyVersionInfo
     */
    name?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PolicyVersionInfo
     */
    status?: string | null;
}
/**
 * 
 * @export
 * @interface PrivacyStatusResponse
 */
export interface PrivacyStatusResponse {
    /**
     * 
     * @type {boolean}
     * @memberof PrivacyStatusResponse
     */
    available: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PrivacyStatusResponse
     */
    enabled: boolean;
    /**
     * 
     * @type {string}
     * @memberof PrivacyStatusResponse
     */
    modelSize?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof PrivacyStatusResponse
     */
    languages?: Array<string>;
}
/**
 * 
 * @export
 * @interface ReadyResponse
 */
export interface ReadyResponse {
    /**
     * 
     * @type {string}
     * @memberof ReadyResponse
     */
    status: string;
    /**
     * 
     * @type {number}
     * @memberof ReadyResponse
     */
    policiesLoaded: number;
}
/**
 * A record reference for enforcement scans.
 * @export
 * @interface RecordRef
 */
export interface RecordRef {
    /**
     * 
     * @type {string}
     * @memberof RecordRef
     */
    recordId: string;
    /**
     * 
     * @type {string}
     * @memberof RecordRef
     */
    dataType: string;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof RecordRef
     */
    metadata?: { [key: string]: any; };
    /**
     * 
     * @type {string}
     * @memberof RecordRef
     */
    source?: string | null;
    /**
     * 
     * @type {string}
     * @memberof RecordRef
     */
    jurisdiction?: string | null;
}
/**
 * AI web-research citation attached as policy provenance metadata.
 * @export
 * @interface ReferenceSource
 */
export interface ReferenceSource {
    /**
     * 
     * @type {number}
     * @memberof ReferenceSource
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof ReferenceSource
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof ReferenceSource
     */
    url: string;
    /**
     * 
     * @type {string}
     * @memberof ReferenceSource
     */
    snippet?: string;
    /**
     * 
     * @type {string}
     * @memberof ReferenceSource
     */
    domain?: string;
}
/**
 * 
 * @export
 * @interface ScopeExclude
 */
export interface ScopeExclude {
    /**
     * 
     * @type {Array<string>}
     * @memberof ScopeExclude
     */
    dataTypes?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ScopeExclude
     */
    sources?: Array<string>;
}

/**
 * 
 * @export
 */
export const Sensitivity = {
    Low: 'low',
    Medium: 'medium',
    High: 'high',
    Critical: 'critical'
} as const;
export type Sensitivity = typeof Sensitivity[keyof typeof Sensitivity];

/**
 * 
 * @export
 * @interface UnmaskRequest
 */
export interface UnmaskRequest {
    /**
     * 
     * @type {string}
     * @memberof UnmaskRequest
     */
    text: string;
    /**
     * 
     * @type {string}
     * @memberof UnmaskRequest
     */
    mappingToken: string;
    /**
     * 
     * @type {boolean}
     * @memberof UnmaskRequest
     */
    consumeToken?: boolean;
}
/**
 * 
 * @export
 * @interface UnmaskResponse
 */
export interface UnmaskResponse {
    /**
     * 
     * @type {string}
     * @memberof UnmaskResponse
     */
    text: string;
}
/**
 * 
 * @export
 * @interface ValidateRequest
 */
export interface ValidateRequest {
    /**
     * 
     * @type {string}
     * @memberof ValidateRequest
     */
    yaml?: string | null;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof ValidateRequest
     */
    policy?: { [key: string]: any; } | null;
}
/**
 * 
 * @export
 * @interface ValidateResponse
 */
export interface ValidateResponse {
    /**
     * 
     * @type {boolean}
     * @memberof ValidateResponse
     */
    valid: boolean;
    /**
     * 
     * @type {Policy}
     * @memberof ValidateResponse
     */
    policy?: Policy | null;
    /**
     * 
     * @type {ClassificationPolicy}
     * @memberof ValidateResponse
     */
    classificationPolicy?: ClassificationPolicy | null;
    /**
     * 
     * @type {PolicyKind}
     * @memberof ValidateResponse
     */
    policyKind?: PolicyKind | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof ValidateResponse
     */
    errors?: Array<string>;
}


/**
 * 
 * @export
 * @interface ValidationError
 */
export interface ValidationError {
    /**
     * 
     * @type {Array<ValidationErrorLocInner>}
     * @memberof ValidationError
     */
    loc: Array<ValidationErrorLocInner>;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    msg: string;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    type: string;
    /**
     * 
     * @type {any}
     * @memberof ValidationError
     */
    input?: any | null;
    /**
     * 
     * @type {object}
     * @memberof ValidationError
     */
    ctx?: object;
}
/**
 * 
 * @export
 * @interface ValidationErrorLocInner
 */
export interface ValidationErrorLocInner {
}
/**
 * POST /api/v1/webhooks body.
 * @export
 * @interface WebhookCreateRequest
 */
export interface WebhookCreateRequest {
    /**
     * 
     * @type {string}
     * @memberof WebhookCreateRequest
     */
    url: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof WebhookCreateRequest
     */
    events: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof WebhookCreateRequest
     */
    secret?: string | null;
    /**
     * 
     * @type {string}
     * @memberof WebhookCreateRequest
     */
    description?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof WebhookCreateRequest
     */
    active?: boolean;
}
/**
 * Create response includes secret once for the client to store.
 * @export
 * @interface WebhookCreateResponse
 */
export interface WebhookCreateResponse {
    /**
     * 
     * @type {string}
     * @memberof WebhookCreateResponse
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof WebhookCreateResponse
     */
    url: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof WebhookCreateResponse
     */
    events: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof WebhookCreateResponse
     */
    description?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof WebhookCreateResponse
     */
    active?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof WebhookCreateResponse
     */
    secretSet?: boolean;
    /**
     * 
     * @type {string}
     * @memberof WebhookCreateResponse
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof WebhookCreateResponse
     */
    updatedAt: string;
    /**
     * 
     * @type {string}
     * @memberof WebhookCreateResponse
     */
    secret: string;
}
/**
 * Public webhook view (secret omitted).
 * @export
 * @interface WebhookResponse
 */
export interface WebhookResponse {
    /**
     * 
     * @type {string}
     * @memberof WebhookResponse
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof WebhookResponse
     */
    url: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof WebhookResponse
     */
    events: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof WebhookResponse
     */
    description?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof WebhookResponse
     */
    active?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof WebhookResponse
     */
    secretSet?: boolean;
    /**
     * 
     * @type {string}
     * @memberof WebhookResponse
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof WebhookResponse
     */
    updatedAt: string;
}
/**
 * PATCH /api/v1/webhooks/{id} body.
 * @export
 * @interface WebhookUpdateRequest
 */
export interface WebhookUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof WebhookUpdateRequest
     */
    url?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof WebhookUpdateRequest
     */
    events?: Array<string> | null;
    /**
     * 
     * @type {string}
     * @memberof WebhookUpdateRequest
     */
    secret?: string | null;
    /**
     * 
     * @type {string}
     * @memberof WebhookUpdateRequest
     */
    description?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof WebhookUpdateRequest
     */
    active?: boolean | null;
}
