# DsarRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**Type** | [**DsarRequestType**](DsarRequestType.md) |  | 
**Status** | Pointer to [**DsarRequestStatus**](DsarRequestStatus.md) |  | [optional] 
**SubjectId** | **string** |  | 
**PolicyId** | **string** |  | 
**Identity** | Pointer to **map[string]interface{}** |  | [optional] 
**RequestedAt** | **time.Time** |  | 
**DueAt** | Pointer to **NullableTime** |  | [optional] 
**CompletedAt** | Pointer to **NullableTime** |  | [optional] 
**InlineRecords** | Pointer to [**[]RecordRef**](RecordRef.md) |  | [optional] 
**Result** | Pointer to [**DsarResult**](DsarResult.md) |  | [optional] 
**Error** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewDsarRequest

`func NewDsarRequest(id string, type_ DsarRequestType, subjectId string, policyId string, requestedAt time.Time, ) *DsarRequest`

NewDsarRequest instantiates a new DsarRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDsarRequestWithDefaults

`func NewDsarRequestWithDefaults() *DsarRequest`

NewDsarRequestWithDefaults instantiates a new DsarRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *DsarRequest) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *DsarRequest) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *DsarRequest) SetId(v string)`

SetId sets Id field to given value.


### GetType

`func (o *DsarRequest) GetType() DsarRequestType`

GetType returns the Type field if non-nil, zero value otherwise.

### GetTypeOk

`func (o *DsarRequest) GetTypeOk() (*DsarRequestType, bool)`

GetTypeOk returns a tuple with the Type field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetType

`func (o *DsarRequest) SetType(v DsarRequestType)`

SetType sets Type field to given value.


### GetStatus

`func (o *DsarRequest) GetStatus() DsarRequestStatus`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *DsarRequest) GetStatusOk() (*DsarRequestStatus, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *DsarRequest) SetStatus(v DsarRequestStatus)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *DsarRequest) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetSubjectId

`func (o *DsarRequest) GetSubjectId() string`

GetSubjectId returns the SubjectId field if non-nil, zero value otherwise.

### GetSubjectIdOk

`func (o *DsarRequest) GetSubjectIdOk() (*string, bool)`

GetSubjectIdOk returns a tuple with the SubjectId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubjectId

`func (o *DsarRequest) SetSubjectId(v string)`

SetSubjectId sets SubjectId field to given value.


### GetPolicyId

`func (o *DsarRequest) GetPolicyId() string`

GetPolicyId returns the PolicyId field if non-nil, zero value otherwise.

### GetPolicyIdOk

`func (o *DsarRequest) GetPolicyIdOk() (*string, bool)`

GetPolicyIdOk returns a tuple with the PolicyId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyId

`func (o *DsarRequest) SetPolicyId(v string)`

SetPolicyId sets PolicyId field to given value.


### GetIdentity

`func (o *DsarRequest) GetIdentity() map[string]interface{}`

GetIdentity returns the Identity field if non-nil, zero value otherwise.

### GetIdentityOk

`func (o *DsarRequest) GetIdentityOk() (*map[string]interface{}, bool)`

GetIdentityOk returns a tuple with the Identity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIdentity

`func (o *DsarRequest) SetIdentity(v map[string]interface{})`

SetIdentity sets Identity field to given value.

### HasIdentity

`func (o *DsarRequest) HasIdentity() bool`

HasIdentity returns a boolean if a field has been set.

### SetIdentityNil

`func (o *DsarRequest) SetIdentityNil(b bool)`

 SetIdentityNil sets the value for Identity to be an explicit nil

### UnsetIdentity
`func (o *DsarRequest) UnsetIdentity()`

UnsetIdentity ensures that no value is present for Identity, not even an explicit nil
### GetRequestedAt

`func (o *DsarRequest) GetRequestedAt() time.Time`

GetRequestedAt returns the RequestedAt field if non-nil, zero value otherwise.

### GetRequestedAtOk

`func (o *DsarRequest) GetRequestedAtOk() (*time.Time, bool)`

GetRequestedAtOk returns a tuple with the RequestedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequestedAt

`func (o *DsarRequest) SetRequestedAt(v time.Time)`

SetRequestedAt sets RequestedAt field to given value.


### GetDueAt

`func (o *DsarRequest) GetDueAt() time.Time`

GetDueAt returns the DueAt field if non-nil, zero value otherwise.

### GetDueAtOk

`func (o *DsarRequest) GetDueAtOk() (*time.Time, bool)`

GetDueAtOk returns a tuple with the DueAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDueAt

`func (o *DsarRequest) SetDueAt(v time.Time)`

SetDueAt sets DueAt field to given value.

### HasDueAt

`func (o *DsarRequest) HasDueAt() bool`

HasDueAt returns a boolean if a field has been set.

### SetDueAtNil

`func (o *DsarRequest) SetDueAtNil(b bool)`

 SetDueAtNil sets the value for DueAt to be an explicit nil

### UnsetDueAt
`func (o *DsarRequest) UnsetDueAt()`

UnsetDueAt ensures that no value is present for DueAt, not even an explicit nil
### GetCompletedAt

`func (o *DsarRequest) GetCompletedAt() time.Time`

GetCompletedAt returns the CompletedAt field if non-nil, zero value otherwise.

### GetCompletedAtOk

`func (o *DsarRequest) GetCompletedAtOk() (*time.Time, bool)`

GetCompletedAtOk returns a tuple with the CompletedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCompletedAt

`func (o *DsarRequest) SetCompletedAt(v time.Time)`

SetCompletedAt sets CompletedAt field to given value.

### HasCompletedAt

`func (o *DsarRequest) HasCompletedAt() bool`

HasCompletedAt returns a boolean if a field has been set.

### SetCompletedAtNil

`func (o *DsarRequest) SetCompletedAtNil(b bool)`

 SetCompletedAtNil sets the value for CompletedAt to be an explicit nil

### UnsetCompletedAt
`func (o *DsarRequest) UnsetCompletedAt()`

UnsetCompletedAt ensures that no value is present for CompletedAt, not even an explicit nil
### GetInlineRecords

`func (o *DsarRequest) GetInlineRecords() []RecordRef`

GetInlineRecords returns the InlineRecords field if non-nil, zero value otherwise.

### GetInlineRecordsOk

`func (o *DsarRequest) GetInlineRecordsOk() (*[]RecordRef, bool)`

GetInlineRecordsOk returns a tuple with the InlineRecords field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetInlineRecords

`func (o *DsarRequest) SetInlineRecords(v []RecordRef)`

SetInlineRecords sets InlineRecords field to given value.

### HasInlineRecords

`func (o *DsarRequest) HasInlineRecords() bool`

HasInlineRecords returns a boolean if a field has been set.

### SetInlineRecordsNil

`func (o *DsarRequest) SetInlineRecordsNil(b bool)`

 SetInlineRecordsNil sets the value for InlineRecords to be an explicit nil

### UnsetInlineRecords
`func (o *DsarRequest) UnsetInlineRecords()`

UnsetInlineRecords ensures that no value is present for InlineRecords, not even an explicit nil
### GetResult

`func (o *DsarRequest) GetResult() DsarResult`

GetResult returns the Result field if non-nil, zero value otherwise.

### GetResultOk

`func (o *DsarRequest) GetResultOk() (*DsarResult, bool)`

GetResultOk returns a tuple with the Result field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResult

`func (o *DsarRequest) SetResult(v DsarResult)`

SetResult sets Result field to given value.

### HasResult

`func (o *DsarRequest) HasResult() bool`

HasResult returns a boolean if a field has been set.

### GetError

`func (o *DsarRequest) GetError() string`

GetError returns the Error field if non-nil, zero value otherwise.

### GetErrorOk

`func (o *DsarRequest) GetErrorOk() (*string, bool)`

GetErrorOk returns a tuple with the Error field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetError

`func (o *DsarRequest) SetError(v string)`

SetError sets Error field to given value.

### HasError

`func (o *DsarRequest) HasError() bool`

HasError returns a boolean if a field has been set.

### SetErrorNil

`func (o *DsarRequest) SetErrorNil(b bool)`

 SetErrorNil sets the value for Error to be an explicit nil

### UnsetError
`func (o *DsarRequest) UnsetError()`

UnsetError ensures that no value is present for Error, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


