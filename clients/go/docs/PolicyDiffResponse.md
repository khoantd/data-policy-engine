# PolicyDiffResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**PolicyId** | **string** |  | 
**FromVersion** | **int32** |  | 
**ToVersion** | **int32** |  | 
**Changes** | Pointer to [**[]PolicyDiffChange**](PolicyDiffChange.md) |  | [optional] 

## Methods

### NewPolicyDiffResponse

`func NewPolicyDiffResponse(policyId string, fromVersion int32, toVersion int32, ) *PolicyDiffResponse`

NewPolicyDiffResponse instantiates a new PolicyDiffResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPolicyDiffResponseWithDefaults

`func NewPolicyDiffResponseWithDefaults() *PolicyDiffResponse`

NewPolicyDiffResponseWithDefaults instantiates a new PolicyDiffResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetPolicyId

`func (o *PolicyDiffResponse) GetPolicyId() string`

GetPolicyId returns the PolicyId field if non-nil, zero value otherwise.

### GetPolicyIdOk

`func (o *PolicyDiffResponse) GetPolicyIdOk() (*string, bool)`

GetPolicyIdOk returns a tuple with the PolicyId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyId

`func (o *PolicyDiffResponse) SetPolicyId(v string)`

SetPolicyId sets PolicyId field to given value.


### GetFromVersion

`func (o *PolicyDiffResponse) GetFromVersion() int32`

GetFromVersion returns the FromVersion field if non-nil, zero value otherwise.

### GetFromVersionOk

`func (o *PolicyDiffResponse) GetFromVersionOk() (*int32, bool)`

GetFromVersionOk returns a tuple with the FromVersion field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFromVersion

`func (o *PolicyDiffResponse) SetFromVersion(v int32)`

SetFromVersion sets FromVersion field to given value.


### GetToVersion

`func (o *PolicyDiffResponse) GetToVersion() int32`

GetToVersion returns the ToVersion field if non-nil, zero value otherwise.

### GetToVersionOk

`func (o *PolicyDiffResponse) GetToVersionOk() (*int32, bool)`

GetToVersionOk returns a tuple with the ToVersion field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetToVersion

`func (o *PolicyDiffResponse) SetToVersion(v int32)`

SetToVersion sets ToVersion field to given value.


### GetChanges

`func (o *PolicyDiffResponse) GetChanges() []PolicyDiffChange`

GetChanges returns the Changes field if non-nil, zero value otherwise.

### GetChangesOk

`func (o *PolicyDiffResponse) GetChangesOk() (*[]PolicyDiffChange, bool)`

GetChangesOk returns a tuple with the Changes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetChanges

`func (o *PolicyDiffResponse) SetChanges(v []PolicyDiffChange)`

SetChanges sets Changes field to given value.

### HasChanges

`func (o *PolicyDiffResponse) HasChanges() bool`

HasChanges returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


