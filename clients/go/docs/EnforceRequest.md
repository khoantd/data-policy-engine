# EnforceRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**PolicyId** | Pointer to **NullableString** |  | [optional] 
**Records** | Pointer to [**[]RecordRef**](RecordRef.md) |  | [optional] 

## Methods

### NewEnforceRequest

`func NewEnforceRequest() *EnforceRequest`

NewEnforceRequest instantiates a new EnforceRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewEnforceRequestWithDefaults

`func NewEnforceRequestWithDefaults() *EnforceRequest`

NewEnforceRequestWithDefaults instantiates a new EnforceRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetPolicyId

`func (o *EnforceRequest) GetPolicyId() string`

GetPolicyId returns the PolicyId field if non-nil, zero value otherwise.

### GetPolicyIdOk

`func (o *EnforceRequest) GetPolicyIdOk() (*string, bool)`

GetPolicyIdOk returns a tuple with the PolicyId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyId

`func (o *EnforceRequest) SetPolicyId(v string)`

SetPolicyId sets PolicyId field to given value.

### HasPolicyId

`func (o *EnforceRequest) HasPolicyId() bool`

HasPolicyId returns a boolean if a field has been set.

### SetPolicyIdNil

`func (o *EnforceRequest) SetPolicyIdNil(b bool)`

 SetPolicyIdNil sets the value for PolicyId to be an explicit nil

### UnsetPolicyId
`func (o *EnforceRequest) UnsetPolicyId()`

UnsetPolicyId ensures that no value is present for PolicyId, not even an explicit nil
### GetRecords

`func (o *EnforceRequest) GetRecords() []RecordRef`

GetRecords returns the Records field if non-nil, zero value otherwise.

### GetRecordsOk

`func (o *EnforceRequest) GetRecordsOk() (*[]RecordRef, bool)`

GetRecordsOk returns a tuple with the Records field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecords

`func (o *EnforceRequest) SetRecords(v []RecordRef)`

SetRecords sets Records field to given value.

### HasRecords

`func (o *EnforceRequest) HasRecords() bool`

HasRecords returns a boolean if a field has been set.

### SetRecordsNil

`func (o *EnforceRequest) SetRecordsNil(b bool)`

 SetRecordsNil sets the value for Records to be an explicit nil

### UnsetRecords
`func (o *EnforceRequest) UnsetRecords()`

UnsetRecords ensures that no value is present for Records, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


