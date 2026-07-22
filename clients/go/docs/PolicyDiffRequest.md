# PolicyDiffRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**FromVersion** | **int32** |  | 
**ToVersion** | **int32** |  | 

## Methods

### NewPolicyDiffRequest

`func NewPolicyDiffRequest(fromVersion int32, toVersion int32, ) *PolicyDiffRequest`

NewPolicyDiffRequest instantiates a new PolicyDiffRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPolicyDiffRequestWithDefaults

`func NewPolicyDiffRequestWithDefaults() *PolicyDiffRequest`

NewPolicyDiffRequestWithDefaults instantiates a new PolicyDiffRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetFromVersion

`func (o *PolicyDiffRequest) GetFromVersion() int32`

GetFromVersion returns the FromVersion field if non-nil, zero value otherwise.

### GetFromVersionOk

`func (o *PolicyDiffRequest) GetFromVersionOk() (*int32, bool)`

GetFromVersionOk returns a tuple with the FromVersion field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFromVersion

`func (o *PolicyDiffRequest) SetFromVersion(v int32)`

SetFromVersion sets FromVersion field to given value.


### GetToVersion

`func (o *PolicyDiffRequest) GetToVersion() int32`

GetToVersion returns the ToVersion field if non-nil, zero value otherwise.

### GetToVersionOk

`func (o *PolicyDiffRequest) GetToVersionOk() (*int32, bool)`

GetToVersionOk returns a tuple with the ToVersion field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetToVersion

`func (o *PolicyDiffRequest) SetToVersion(v int32)`

SetToVersion sets ToVersion field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


