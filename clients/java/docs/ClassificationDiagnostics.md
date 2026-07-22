

# ClassificationDiagnostics

Why a policy did or did not apply to this request.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**applicablePolicyCount** | **Integer** |  |  [optional] |
|**selectedPolicyApplied** | **Boolean** |  |  [optional] |
|**outOfScopeReason** | [**OutOfScopeReasonEnum**](#OutOfScopeReasonEnum) |  |  [optional] |
|**policyScopeSummary** | [**ClassificationPolicyScopeSummary**](ClassificationPolicyScopeSummary.md) |  |  [optional] |



## Enum: OutOfScopeReasonEnum

| Name | Value |
|---- | -----|
| NONE | &quot;none&quot; |
| JURISDICTION | &quot;jurisdiction&quot; |
| DATA_TYPE | &quot;data_type&quot; |
| SOURCE | &quot;source&quot; |



