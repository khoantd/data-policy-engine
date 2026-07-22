# AuditConfig

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**LogEvaluations** | Pointer to **bool** |  | [optional] [default to true]
**LogActions** | Pointer to **bool** |  | [optional] [default to true]
**RetentionOfAuditLogs** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewAuditConfig

`func NewAuditConfig() *AuditConfig`

NewAuditConfig instantiates a new AuditConfig object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewAuditConfigWithDefaults

`func NewAuditConfigWithDefaults() *AuditConfig`

NewAuditConfigWithDefaults instantiates a new AuditConfig object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetLogEvaluations

`func (o *AuditConfig) GetLogEvaluations() bool`

GetLogEvaluations returns the LogEvaluations field if non-nil, zero value otherwise.

### GetLogEvaluationsOk

`func (o *AuditConfig) GetLogEvaluationsOk() (*bool, bool)`

GetLogEvaluationsOk returns a tuple with the LogEvaluations field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLogEvaluations

`func (o *AuditConfig) SetLogEvaluations(v bool)`

SetLogEvaluations sets LogEvaluations field to given value.

### HasLogEvaluations

`func (o *AuditConfig) HasLogEvaluations() bool`

HasLogEvaluations returns a boolean if a field has been set.

### GetLogActions

`func (o *AuditConfig) GetLogActions() bool`

GetLogActions returns the LogActions field if non-nil, zero value otherwise.

### GetLogActionsOk

`func (o *AuditConfig) GetLogActionsOk() (*bool, bool)`

GetLogActionsOk returns a tuple with the LogActions field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLogActions

`func (o *AuditConfig) SetLogActions(v bool)`

SetLogActions sets LogActions field to given value.

### HasLogActions

`func (o *AuditConfig) HasLogActions() bool`

HasLogActions returns a boolean if a field has been set.

### GetRetentionOfAuditLogs

`func (o *AuditConfig) GetRetentionOfAuditLogs() string`

GetRetentionOfAuditLogs returns the RetentionOfAuditLogs field if non-nil, zero value otherwise.

### GetRetentionOfAuditLogsOk

`func (o *AuditConfig) GetRetentionOfAuditLogsOk() (*string, bool)`

GetRetentionOfAuditLogsOk returns a tuple with the RetentionOfAuditLogs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRetentionOfAuditLogs

`func (o *AuditConfig) SetRetentionOfAuditLogs(v string)`

SetRetentionOfAuditLogs sets RetentionOfAuditLogs field to given value.

### HasRetentionOfAuditLogs

`func (o *AuditConfig) HasRetentionOfAuditLogs() bool`

HasRetentionOfAuditLogs returns a boolean if a field has been set.

### SetRetentionOfAuditLogsNil

`func (o *AuditConfig) SetRetentionOfAuditLogsNil(b bool)`

 SetRetentionOfAuditLogsNil sets the value for RetentionOfAuditLogs to be an explicit nil

### UnsetRetentionOfAuditLogs
`func (o *AuditConfig) UnsetRetentionOfAuditLogs()`

UnsetRetentionOfAuditLogs ensures that no value is present for RetentionOfAuditLogs, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


