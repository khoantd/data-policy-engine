

# ClassificationPolicy

Full classification policy definition.

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
|**entities** | [**List&lt;ClassificationEntity&gt;**](ClassificationEntity.md) |  |  |
|**rules** | [**List&lt;ClassificationRule&gt;**](ClassificationRule.md) |  |  |
|**textFields** | **List&lt;String&gt;** | Metadata field paths scanned with NER when privalyse is available |  [optional] |



