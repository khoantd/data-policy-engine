# AuditEntry

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**CreatedAt** | **time.Time** |  | 
**EventType** | [**AuditEventType**](AuditEventType.md) |  | 
**PolicyId** | Pointer to **NullableString** |  | [optional] 
**RuleId** | Pointer to **NullableString** |  | [optional] 
**RecordId** | Pointer to **NullableString** |  | [optional] 
**Action** | Pointer to **NullableString** |  | [optional] 
**Payload** | Pointer to **map[string]interface{}** |  | [optional] 
**JobId** | Pointer to **NullableString** |  | [optional] 
**EvaluationId** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewAuditEntry

`func NewAuditEntry(id string, createdAt time.Time, eventType AuditEventType, ) *AuditEntry`

NewAuditEntry instantiates a new AuditEntry object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewAuditEntryWithDefaults

`func NewAuditEntryWithDefaults() *AuditEntry`

NewAuditEntryWithDefaults instantiates a new AuditEntry object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *AuditEntry) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *AuditEntry) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *AuditEntry) SetId(v string)`

SetId sets Id field to given value.


### GetCreatedAt

`func (o *AuditEntry) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *AuditEntry) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *AuditEntry) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.


### GetEventType

`func (o *AuditEntry) GetEventType() AuditEventType`

GetEventType returns the EventType field if non-nil, zero value otherwise.

### GetEventTypeOk

`func (o *AuditEntry) GetEventTypeOk() (*AuditEventType, bool)`

GetEventTypeOk returns a tuple with the EventType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventType

`func (o *AuditEntry) SetEventType(v AuditEventType)`

SetEventType sets EventType field to given value.


### GetPolicyId

`func (o *AuditEntry) GetPolicyId() string`

GetPolicyId returns the PolicyId field if non-nil, zero value otherwise.

### GetPolicyIdOk

`func (o *AuditEntry) GetPolicyIdOk() (*string, bool)`

GetPolicyIdOk returns a tuple with the PolicyId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyId

`func (o *AuditEntry) SetPolicyId(v string)`

SetPolicyId sets PolicyId field to given value.

### HasPolicyId

`func (o *AuditEntry) HasPolicyId() bool`

HasPolicyId returns a boolean if a field has been set.

### SetPolicyIdNil

`func (o *AuditEntry) SetPolicyIdNil(b bool)`

 SetPolicyIdNil sets the value for PolicyId to be an explicit nil

### UnsetPolicyId
`func (o *AuditEntry) UnsetPolicyId()`

UnsetPolicyId ensures that no value is present for PolicyId, not even an explicit nil
### GetRuleId

`func (o *AuditEntry) GetRuleId() string`

GetRuleId returns the RuleId field if non-nil, zero value otherwise.

### GetRuleIdOk

`func (o *AuditEntry) GetRuleIdOk() (*string, bool)`

GetRuleIdOk returns a tuple with the RuleId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRuleId

`func (o *AuditEntry) SetRuleId(v string)`

SetRuleId sets RuleId field to given value.

### HasRuleId

`func (o *AuditEntry) HasRuleId() bool`

HasRuleId returns a boolean if a field has been set.

### SetRuleIdNil

`func (o *AuditEntry) SetRuleIdNil(b bool)`

 SetRuleIdNil sets the value for RuleId to be an explicit nil

### UnsetRuleId
`func (o *AuditEntry) UnsetRuleId()`

UnsetRuleId ensures that no value is present for RuleId, not even an explicit nil
### GetRecordId

`func (o *AuditEntry) GetRecordId() string`

GetRecordId returns the RecordId field if non-nil, zero value otherwise.

### GetRecordIdOk

`func (o *AuditEntry) GetRecordIdOk() (*string, bool)`

GetRecordIdOk returns a tuple with the RecordId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecordId

`func (o *AuditEntry) SetRecordId(v string)`

SetRecordId sets RecordId field to given value.

### HasRecordId

`func (o *AuditEntry) HasRecordId() bool`

HasRecordId returns a boolean if a field has been set.

### SetRecordIdNil

`func (o *AuditEntry) SetRecordIdNil(b bool)`

 SetRecordIdNil sets the value for RecordId to be an explicit nil

### UnsetRecordId
`func (o *AuditEntry) UnsetRecordId()`

UnsetRecordId ensures that no value is present for RecordId, not even an explicit nil
### GetAction

`func (o *AuditEntry) GetAction() string`

GetAction returns the Action field if non-nil, zero value otherwise.

### GetActionOk

`func (o *AuditEntry) GetActionOk() (*string, bool)`

GetActionOk returns a tuple with the Action field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAction

`func (o *AuditEntry) SetAction(v string)`

SetAction sets Action field to given value.

### HasAction

`func (o *AuditEntry) HasAction() bool`

HasAction returns a boolean if a field has been set.

### SetActionNil

`func (o *AuditEntry) SetActionNil(b bool)`

 SetActionNil sets the value for Action to be an explicit nil

### UnsetAction
`func (o *AuditEntry) UnsetAction()`

UnsetAction ensures that no value is present for Action, not even an explicit nil
### GetPayload

`func (o *AuditEntry) GetPayload() map[string]interface{}`

GetPayload returns the Payload field if non-nil, zero value otherwise.

### GetPayloadOk

`func (o *AuditEntry) GetPayloadOk() (*map[string]interface{}, bool)`

GetPayloadOk returns a tuple with the Payload field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayload

`func (o *AuditEntry) SetPayload(v map[string]interface{})`

SetPayload sets Payload field to given value.

### HasPayload

`func (o *AuditEntry) HasPayload() bool`

HasPayload returns a boolean if a field has been set.

### GetJobId

`func (o *AuditEntry) GetJobId() string`

GetJobId returns the JobId field if non-nil, zero value otherwise.

### GetJobIdOk

`func (o *AuditEntry) GetJobIdOk() (*string, bool)`

GetJobIdOk returns a tuple with the JobId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetJobId

`func (o *AuditEntry) SetJobId(v string)`

SetJobId sets JobId field to given value.

### HasJobId

`func (o *AuditEntry) HasJobId() bool`

HasJobId returns a boolean if a field has been set.

### SetJobIdNil

`func (o *AuditEntry) SetJobIdNil(b bool)`

 SetJobIdNil sets the value for JobId to be an explicit nil

### UnsetJobId
`func (o *AuditEntry) UnsetJobId()`

UnsetJobId ensures that no value is present for JobId, not even an explicit nil
### GetEvaluationId

`func (o *AuditEntry) GetEvaluationId() string`

GetEvaluationId returns the EvaluationId field if non-nil, zero value otherwise.

### GetEvaluationIdOk

`func (o *AuditEntry) GetEvaluationIdOk() (*string, bool)`

GetEvaluationIdOk returns a tuple with the EvaluationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEvaluationId

`func (o *AuditEntry) SetEvaluationId(v string)`

SetEvaluationId sets EvaluationId field to given value.

### HasEvaluationId

`func (o *AuditEntry) HasEvaluationId() bool`

HasEvaluationId returns a boolean if a field has been set.

### SetEvaluationIdNil

`func (o *AuditEntry) SetEvaluationIdNil(b bool)`

 SetEvaluationIdNil sets the value for EvaluationId to be an explicit nil

### UnsetEvaluationId
`func (o *AuditEntry) UnsetEvaluationId()`

UnsetEvaluationId ensures that no value is present for EvaluationId, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


