

# AgentPolicy

Agent safety policy backed by an OpenGuardrails document.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**id** | **String** |  |  |
|**name** | **String** |  |  |
|**version** | **Integer** |  |  [optional] |
|**status** | **PolicyStatus** |  |  [optional] |
|**jurisdiction** | **String** |  |  |
|**policyKind** | **PolicyKind** |  |  [optional] |
|**owner** | **String** |  |  [optional] |
|**effectiveFrom** | [**EffectiveFrom**](EffectiveFrom.md) |  |  [optional] |
|**expiresAt** | [**ExpiresAt**](ExpiresAt.md) |  |  [optional] |
|**tags** | **List&lt;String&gt;** |  |  [optional] |
|**scope** | [**PolicyScope**](PolicyScope.md) |  |  [optional] |
|**ogrPolicy** | **Map&lt;String, Object&gt;** |  |  |
|**rules** | **List&lt;Object&gt;** |  |  [optional] |
|**referenceSources** | [**List&lt;ReferenceSource&gt;**](ReferenceSource.md) |  |  [optional] |



