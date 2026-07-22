# DsarSubmitRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**SubjectId** | **string** |  | 
**PolicyId** | **string** |  | 
**Identity** | Pointer to **map[string]interface{}** |  | [optional] 
**Records** | Pointer to [**[]RecordRef**](RecordRef.md) |  | [optional] 

## Methods

### NewDsarSubmitRequest

`func NewDsarSubmitRequest(subjectId string, policyId string, ) *DsarSubmitRequest`

NewDsarSubmitRequest instantiates a new DsarSubmitRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDsarSubmitRequestWithDefaults

`func NewDsarSubmitRequestWithDefaults() *DsarSubmitRequest`

NewDsarSubmitRequestWithDefaults instantiates a new DsarSubmitRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSubjectId

`func (o *DsarSubmitRequest) GetSubjectId() string`

GetSubjectId returns the SubjectId field if non-nil, zero value otherwise.

### GetSubjectIdOk

`func (o *DsarSubmitRequest) GetSubjectIdOk() (*string, bool)`

GetSubjectIdOk returns a tuple with the SubjectId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubjectId

`func (o *DsarSubmitRequest) SetSubjectId(v string)`

SetSubjectId sets SubjectId field to given value.


### GetPolicyId

`func (o *DsarSubmitRequest) GetPolicyId() string`

GetPolicyId returns the PolicyId field if non-nil, zero value otherwise.

### GetPolicyIdOk

`func (o *DsarSubmitRequest) GetPolicyIdOk() (*string, bool)`

GetPolicyIdOk returns a tuple with the PolicyId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyId

`func (o *DsarSubmitRequest) SetPolicyId(v string)`

SetPolicyId sets PolicyId field to given value.


### GetIdentity

`func (o *DsarSubmitRequest) GetIdentity() map[string]interface{}`

GetIdentity returns the Identity field if non-nil, zero value otherwise.

### GetIdentityOk

`func (o *DsarSubmitRequest) GetIdentityOk() (*map[string]interface{}, bool)`

GetIdentityOk returns a tuple with the Identity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetIdentity

`func (o *DsarSubmitRequest) SetIdentity(v map[string]interface{})`

SetIdentity sets Identity field to given value.

### HasIdentity

`func (o *DsarSubmitRequest) HasIdentity() bool`

HasIdentity returns a boolean if a field has been set.

### SetIdentityNil

`func (o *DsarSubmitRequest) SetIdentityNil(b bool)`

 SetIdentityNil sets the value for Identity to be an explicit nil

### UnsetIdentity
`func (o *DsarSubmitRequest) UnsetIdentity()`

UnsetIdentity ensures that no value is present for Identity, not even an explicit nil
### GetRecords

`func (o *DsarSubmitRequest) GetRecords() []RecordRef`

GetRecords returns the Records field if non-nil, zero value otherwise.

### GetRecordsOk

`func (o *DsarSubmitRequest) GetRecordsOk() (*[]RecordRef, bool)`

GetRecordsOk returns a tuple with the Records field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecords

`func (o *DsarSubmitRequest) SetRecords(v []RecordRef)`

SetRecords sets Records field to given value.

### HasRecords

`func (o *DsarSubmitRequest) HasRecords() bool`

HasRecords returns a boolean if a field has been set.

### SetRecordsNil

`func (o *DsarSubmitRequest) SetRecordsNil(b bool)`

 SetRecordsNil sets the value for Records to be an explicit nil

### UnsetRecords
`func (o *DsarSubmitRequest) UnsetRecords()`

UnsetRecords ensures that no value is present for Records, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


