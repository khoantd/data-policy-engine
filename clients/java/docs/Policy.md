

# Policy

Full retention policy definition.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**id** | **String** |  |  |
|**name** | **String** |  |  |
|**version** | **Integer** |  |  [optional] |
|**status** | **PolicyStatus** |  |  [optional] |
|**jurisdiction** | **String** |  |  |
|**policyKind** | **PolicyKind** |  |  [optional] |
|**dataClassification** | **DataClassification** |  |  |
|**owner** | **String** |  |  [optional] |
|**effectiveFrom** | [**EffectiveFrom**](EffectiveFrom.md) |  |  [optional] |
|**expiresAt** | [**ExpiresAt**](ExpiresAt.md) |  |  [optional] |
|**tags** | **List&lt;String&gt;** |  |  [optional] |
|**scope** | [**PolicyScope**](PolicyScope.md) |  |  [optional] |
|**rules** | [**List&lt;PolicyRule&gt;**](PolicyRule.md) |  |  |
|**dsar** | [**DsarConfig**](DsarConfig.md) |  |  [optional] |
|**audit** | [**AuditConfig**](AuditConfig.md) |  |  [optional] |



