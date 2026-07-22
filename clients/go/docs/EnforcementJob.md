# EnforcementJob

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**PolicyId** | Pointer to **NullableString** |  | [optional] 
**Status** | Pointer to [**JobStatus**](JobStatus.md) |  | [optional] 
**Trigger** | Pointer to [**JobTrigger**](JobTrigger.md) |  | [optional] 
**RequestedAt** | **time.Time** |  | 
**StartedAt** | Pointer to **NullableTime** |  | [optional] 
**FinishedAt** | Pointer to **NullableTime** |  | [optional] 
**Progress** | Pointer to [**JobProgress**](JobProgress.md) |  | [optional] 
**Error** | Pointer to **NullableString** |  | [optional] 
**InlineRecords** | Pointer to [**[]RecordRef**](RecordRef.md) |  | [optional] 

## Methods

### NewEnforcementJob

`func NewEnforcementJob(id string, requestedAt time.Time, ) *EnforcementJob`

NewEnforcementJob instantiates a new EnforcementJob object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewEnforcementJobWithDefaults

`func NewEnforcementJobWithDefaults() *EnforcementJob`

NewEnforcementJobWithDefaults instantiates a new EnforcementJob object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *EnforcementJob) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *EnforcementJob) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *EnforcementJob) SetId(v string)`

SetId sets Id field to given value.


### GetPolicyId

`func (o *EnforcementJob) GetPolicyId() string`

GetPolicyId returns the PolicyId field if non-nil, zero value otherwise.

### GetPolicyIdOk

`func (o *EnforcementJob) GetPolicyIdOk() (*string, bool)`

GetPolicyIdOk returns a tuple with the PolicyId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyId

`func (o *EnforcementJob) SetPolicyId(v string)`

SetPolicyId sets PolicyId field to given value.

### HasPolicyId

`func (o *EnforcementJob) HasPolicyId() bool`

HasPolicyId returns a boolean if a field has been set.

### SetPolicyIdNil

`func (o *EnforcementJob) SetPolicyIdNil(b bool)`

 SetPolicyIdNil sets the value for PolicyId to be an explicit nil

### UnsetPolicyId
`func (o *EnforcementJob) UnsetPolicyId()`

UnsetPolicyId ensures that no value is present for PolicyId, not even an explicit nil
### GetStatus

`func (o *EnforcementJob) GetStatus() JobStatus`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *EnforcementJob) GetStatusOk() (*JobStatus, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *EnforcementJob) SetStatus(v JobStatus)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *EnforcementJob) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetTrigger

`func (o *EnforcementJob) GetTrigger() JobTrigger`

GetTrigger returns the Trigger field if non-nil, zero value otherwise.

### GetTriggerOk

`func (o *EnforcementJob) GetTriggerOk() (*JobTrigger, bool)`

GetTriggerOk returns a tuple with the Trigger field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTrigger

`func (o *EnforcementJob) SetTrigger(v JobTrigger)`

SetTrigger sets Trigger field to given value.

### HasTrigger

`func (o *EnforcementJob) HasTrigger() bool`

HasTrigger returns a boolean if a field has been set.

### GetRequestedAt

`func (o *EnforcementJob) GetRequestedAt() time.Time`

GetRequestedAt returns the RequestedAt field if non-nil, zero value otherwise.

### GetRequestedAtOk

`func (o *EnforcementJob) GetRequestedAtOk() (*time.Time, bool)`

GetRequestedAtOk returns a tuple with the RequestedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequestedAt

`func (o *EnforcementJob) SetRequestedAt(v time.Time)`

SetRequestedAt sets RequestedAt field to given value.


### GetStartedAt

`func (o *EnforcementJob) GetStartedAt() time.Time`

GetStartedAt returns the StartedAt field if non-nil, zero value otherwise.

### GetStartedAtOk

`func (o *EnforcementJob) GetStartedAtOk() (*time.Time, bool)`

GetStartedAtOk returns a tuple with the StartedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStartedAt

`func (o *EnforcementJob) SetStartedAt(v time.Time)`

SetStartedAt sets StartedAt field to given value.

### HasStartedAt

`func (o *EnforcementJob) HasStartedAt() bool`

HasStartedAt returns a boolean if a field has been set.

### SetStartedAtNil

`func (o *EnforcementJob) SetStartedAtNil(b bool)`

 SetStartedAtNil sets the value for StartedAt to be an explicit nil

### UnsetStartedAt
`func (o *EnforcementJob) UnsetStartedAt()`

UnsetStartedAt ensures that no value is present for StartedAt, not even an explicit nil
### GetFinishedAt

`func (o *EnforcementJob) GetFinishedAt() time.Time`

GetFinishedAt returns the FinishedAt field if non-nil, zero value otherwise.

### GetFinishedAtOk

`func (o *EnforcementJob) GetFinishedAtOk() (*time.Time, bool)`

GetFinishedAtOk returns a tuple with the FinishedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFinishedAt

`func (o *EnforcementJob) SetFinishedAt(v time.Time)`

SetFinishedAt sets FinishedAt field to given value.

### HasFinishedAt

`func (o *EnforcementJob) HasFinishedAt() bool`

HasFinishedAt returns a boolean if a field has been set.

### SetFinishedAtNil

`func (o *EnforcementJob) SetFinishedAtNil(b bool)`

 SetFinishedAtNil sets the value for FinishedAt to be an explicit nil

### UnsetFinishedAt
`func (o *EnforcementJob) UnsetFinishedAt()`

UnsetFinishedAt ensures that no value is present for FinishedAt, not even an explicit nil
### GetProgress

`func (o *EnforcementJob) GetProgress() JobProgress`

GetProgress returns the Progress field if non-nil, zero value otherwise.

### GetProgressOk

`func (o *EnforcementJob) GetProgressOk() (*JobProgress, bool)`

GetProgressOk returns a tuple with the Progress field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProgress

`func (o *EnforcementJob) SetProgress(v JobProgress)`

SetProgress sets Progress field to given value.

### HasProgress

`func (o *EnforcementJob) HasProgress() bool`

HasProgress returns a boolean if a field has been set.

### GetError

`func (o *EnforcementJob) GetError() string`

GetError returns the Error field if non-nil, zero value otherwise.

### GetErrorOk

`func (o *EnforcementJob) GetErrorOk() (*string, bool)`

GetErrorOk returns a tuple with the Error field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetError

`func (o *EnforcementJob) SetError(v string)`

SetError sets Error field to given value.

### HasError

`func (o *EnforcementJob) HasError() bool`

HasError returns a boolean if a field has been set.

### SetErrorNil

`func (o *EnforcementJob) SetErrorNil(b bool)`

 SetErrorNil sets the value for Error to be an explicit nil

### UnsetError
`func (o *EnforcementJob) UnsetError()`

UnsetError ensures that no value is present for Error, not even an explicit nil
### GetInlineRecords

`func (o *EnforcementJob) GetInlineRecords() []RecordRef`

GetInlineRecords returns the InlineRecords field if non-nil, zero value otherwise.

### GetInlineRecordsOk

`func (o *EnforcementJob) GetInlineRecordsOk() (*[]RecordRef, bool)`

GetInlineRecordsOk returns a tuple with the InlineRecords field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInlineRecords

`func (o *EnforcementJob) SetInlineRecords(v []RecordRef)`

SetInlineRecords sets InlineRecords field to given value.

### HasInlineRecords

`func (o *EnforcementJob) HasInlineRecords() bool`

HasInlineRecords returns a boolean if a field has been set.

### SetInlineRecordsNil

`func (o *EnforcementJob) SetInlineRecordsNil(b bool)`

 SetInlineRecordsNil sets the value for InlineRecords to be an explicit nil

### UnsetInlineRecords
`func (o *EnforcementJob) UnsetInlineRecords()`

UnsetInlineRecords ensures that no value is present for InlineRecords, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


