

# PolicyDiffChange

A single structural change between two policy versions.

## Properties

| Name | Type | Description | Notes |
|------------ | ------------- | ------------- | -------------|
|**path** | **String** |  |  |
|**op** | [**OpEnum**](#OpEnum) |  |  |
|**old** | **Object** |  |  [optional] |
|**_new** | **Object** |  |  [optional] |



## Enum: OpEnum

| Name | Value |
|---- | -----|
| ADD | &quot;add&quot; |
| REMOVE | &quot;remove&quot; |
| REPLACE | &quot;replace&quot; |



