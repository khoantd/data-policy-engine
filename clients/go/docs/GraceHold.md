# GraceHold

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**PolicyId** | **string** |  | 
**RuleId** | **string** |  | 
**RecordId** | **string** |  | 
**DataType** | **string** |  | 
**Action** | **string** |  | 
**GracePeriodEnds** | **string** |  | 
**NotifyAt** | Pointer to **NullableString** |  | [optional] 
**Status** | Pointer to [**GraceHoldStatus**](GraceHoldStatus.md) |  | [optional] 
**CreatedAt** | **time.Time** |  | 
**UpdatedAt** | **time.Time** |  | 
**ClosedAt** | Pointer to **NullableTime** |  | [optional] 
**Requester** | Pointer to **NullableString** |  | [optional] 
**SourceJobId** | Pointer to **NullableString** |  | [optional] 
**EvaluationId** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewGraceHold

`func NewGraceHold(id string, policyId string, ruleId string, recordId string, dataType string, action string, gracePeriodEnds string, createdAt time.Time, updatedAt time.Time, ) *GraceHold`

NewGraceHold instantiates a new GraceHold object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGraceHoldWithDefaults

`func NewGraceHoldWithDefaults() *GraceHold`

NewGraceHoldWithDefaults instantiates a new GraceHold object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *GraceHold) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *GraceHold) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *GraceHold) SetId(v string)`

SetId sets Id field to given value.


### GetPolicyId

`func (o *GraceHold) GetPolicyId() string`

GetPolicyId returns the PolicyId field if non-nil, zero value otherwise.

### GetPolicyIdOk

`func (o *GraceHold) GetPolicyIdOk() (*string, bool)`

GetPolicyIdOk returns a tuple with the PolicyId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyId

`func (o *GraceHold) SetPolicyId(v string)`

SetPolicyId sets PolicyId field to given value.


### GetRuleId

`func (o *GraceHold) GetRuleId() string`

GetRuleId returns the RuleId field if non-nil, zero value otherwise.

### GetRuleIdOk

`func (o *GraceHold) GetRuleIdOk() (*string, bool)`

GetRuleIdOk returns a tuple with the RuleId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRuleId

`func (o *GraceHold) SetRuleId(v string)`

SetRuleId sets RuleId field to given value.


### GetRecordId

`func (o *GraceHold) GetRecordId() string`

GetRecordId returns the RecordId field if non-nil, zero value otherwise.

### GetRecordIdOk

`func (o *GraceHold) GetRecordIdOk() (*string, bool)`

GetRecordIdOk returns a tuple with the RecordId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecordId

`func (o *GraceHold) SetRecordId(v string)`

SetRecordId sets RecordId field to given value.


### GetDataType

`func (o *GraceHold) GetDataType() string`

GetDataType returns the DataType field if non-nil, zero value otherwise.

### GetDataTypeOk

`func (o *GraceHold) GetDataTypeOk() (*string, bool)`

GetDataTypeOk returns a tuple with the DataType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDataType

`func (o *GraceHold) SetDataType(v string)`

SetDataType sets DataType field to given value.


### GetAction

`func (o *GraceHold) GetAction() string`

GetAction returns the Action field if non-nil, zero value otherwise.

### GetActionOk

`func (o *GraceHold) GetActionOk() (*string, bool)`

GetActionOk returns a tuple with the Action field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAction

`func (o *GraceHold) SetAction(v string)`

SetAction sets Action field to given value.


### GetGracePeriodEnds

`func (o *GraceHold) GetGracePeriodEnds() string`

GetGracePeriodEnds returns the GracePeriodEnds field if non-nil, zero value otherwise.

### GetGracePeriodEndsOk

`func (o *GraceHold) GetGracePeriodEndsOk() (*string, bool)`

GetGracePeriodEndsOk returns a tuple with the GracePeriodEnds field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGracePeriodEnds

`func (o *GraceHold) SetGracePeriodEnds(v string)`

SetGracePeriodEnds sets GracePeriodEnds field to given value.


### GetNotifyAt

`func (o *GraceHold) GetNotifyAt() string`

GetNotifyAt returns the NotifyAt field if non-nil, zero value otherwise.

### GetNotifyAtOk

`func (o *GraceHold) GetNotifyAtOk() (*string, bool)`

GetNotifyAtOk returns a tuple with the NotifyAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNotifyAt

`func (o *GraceHold) SetNotifyAt(v string)`

SetNotifyAt sets NotifyAt field to given value.

### HasNotifyAt

`func (o *GraceHold) HasNotifyAt() bool`

HasNotifyAt returns a boolean if a field has been set.

### SetNotifyAtNil

`func (o *GraceHold) SetNotifyAtNil(b bool)`

 SetNotifyAtNil sets the value for NotifyAt to be an explicit nil

### UnsetNotifyAt
`func (o *GraceHold) UnsetNotifyAt()`

UnsetNotifyAt ensures that no value is present for NotifyAt, not even an explicit nil
### GetStatus

`func (o *GraceHold) GetStatus() GraceHoldStatus`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *GraceHold) GetStatusOk() (*GraceHoldStatus, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *GraceHold) SetStatus(v GraceHoldStatus)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *GraceHold) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetCreatedAt

`func (o *GraceHold) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *GraceHold) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *GraceHold) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.


### GetUpdatedAt

`func (o *GraceHold) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *GraceHold) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *GraceHold) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.


### GetClosedAt

`func (o *GraceHold) GetClosedAt() time.Time`

GetClosedAt returns the ClosedAt field if non-nil, zero value otherwise.

### GetClosedAtOk

`func (o *GraceHold) GetClosedAtOk() (*time.Time, bool)`

GetClosedAtOk returns a tuple with the ClosedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetClosedAt

`func (o *GraceHold) SetClosedAt(v time.Time)`

SetClosedAt sets ClosedAt field to given value.

### HasClosedAt

`func (o *GraceHold) HasClosedAt() bool`

HasClosedAt returns a boolean if a field has been set.

### SetClosedAtNil

`func (o *GraceHold) SetClosedAtNil(b bool)`

 SetClosedAtNil sets the value for ClosedAt to be an explicit nil

### UnsetClosedAt
`func (o *GraceHold) UnsetClosedAt()`

UnsetClosedAt ensures that no value is present for ClosedAt, not even an explicit nil
### GetRequester

`func (o *GraceHold) GetRequester() string`

GetRequester returns the Requester field if non-nil, zero value otherwise.

### GetRequesterOk

`func (o *GraceHold) GetRequesterOk() (*string, bool)`

GetRequesterOk returns a tuple with the Requester field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequester

`func (o *GraceHold) SetRequester(v string)`

SetRequester sets Requester field to given value.

### HasRequester

`func (o *GraceHold) HasRequester() bool`

HasRequester returns a boolean if a field has been set.

### SetRequesterNil

`func (o *GraceHold) SetRequesterNil(b bool)`

 SetRequesterNil sets the value for Requester to be an explicit nil

### UnsetRequester
`func (o *GraceHold) UnsetRequester()`

UnsetRequester ensures that no value is present for Requester, not even an explicit nil
### GetSourceJobId

`func (o *GraceHold) GetSourceJobId() string`

GetSourceJobId returns the SourceJobId field if non-nil, zero value otherwise.

### GetSourceJobIdOk

`func (o *GraceHold) GetSourceJobIdOk() (*string, bool)`

GetSourceJobIdOk returns a tuple with the SourceJobId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSourceJobId

`func (o *GraceHold) SetSourceJobId(v string)`

SetSourceJobId sets SourceJobId field to given value.

### HasSourceJobId

`func (o *GraceHold) HasSourceJobId() bool`

HasSourceJobId returns a boolean if a field has been set.

### SetSourceJobIdNil

`func (o *GraceHold) SetSourceJobIdNil(b bool)`

 SetSourceJobIdNil sets the value for SourceJobId to be an explicit nil

### UnsetSourceJobId
`func (o *GraceHold) UnsetSourceJobId()`

UnsetSourceJobId ensures that no value is present for SourceJobId, not even an explicit nil
### GetEvaluationId

`func (o *GraceHold) GetEvaluationId() string`

GetEvaluationId returns the EvaluationId field if non-nil, zero value otherwise.

### GetEvaluationIdOk

`func (o *GraceHold) GetEvaluationIdOk() (*string, bool)`

GetEvaluationIdOk returns a tuple with the EvaluationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEvaluationId

`func (o *GraceHold) SetEvaluationId(v string)`

SetEvaluationId sets EvaluationId field to given value.

### HasEvaluationId

`func (o *GraceHold) HasEvaluationId() bool`

HasEvaluationId returns a boolean if a field has been set.

### SetEvaluationIdNil

`func (o *GraceHold) SetEvaluationIdNil(b bool)`

 SetEvaluationIdNil sets the value for EvaluationId to be an explicit nil

### UnsetEvaluationId
`func (o *GraceHold) UnsetEvaluationId()`

UnsetEvaluationId ensures that no value is present for EvaluationId, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


