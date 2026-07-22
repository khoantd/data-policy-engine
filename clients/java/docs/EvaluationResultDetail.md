

# EvaluationResultDetail


## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**action** | **Action** |  |  |
|**matchedPolicy** | **String** |  |  [optional] |
|**matchedRule** | **String** |  |  [optional] |
|**policyVersion** | **Integer** |  |  [optional] |
|**gracePeriodEnds** | **String** |  |  [optional] |
|**notifyAt** | **String** |  |  [optional] |
|**requiresApproval** | **Boolean** |  |  [optional] |
|**confidence** | [**ConfidenceEnum**](#ConfidenceEnum) |  |  [optional] |
|**archiveTarget** | **String** |  |  [optional] |
|**retainUntil** | **String** |  |  [optional] |



## Enum: ConfidenceEnum

| Name | Value |
|---- | -----|
| DEFINITIVE | &quot;definitive&quot; |
| PARTIAL | &quot;partial&quot; |
| NONE | &quot;none&quot; |



