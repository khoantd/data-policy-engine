# GuardrailPolicyUpdateRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Name** | Pointer to **NullableString** |  | [optional] 
**Policy** | Pointer to **map[string]interface{}** |  | [optional] 

## Methods

### NewGuardrailPolicyUpdateRequest

`func NewGuardrailPolicyUpdateRequest() *GuardrailPolicyUpdateRequest`

NewGuardrailPolicyUpdateRequest instantiates a new GuardrailPolicyUpdateRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGuardrailPolicyUpdateRequestWithDefaults

`func NewGuardrailPolicyUpdateRequestWithDefaults() *GuardrailPolicyUpdateRequest`

NewGuardrailPolicyUpdateRequestWithDefaults instantiates a new GuardrailPolicyUpdateRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetName

`func (o *GuardrailPolicyUpdateRequest) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *GuardrailPolicyUpdateRequest) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *GuardrailPolicyUpdateRequest) SetName(v string)`

SetName sets Name field to given value.

### HasName

`func (o *GuardrailPolicyUpdateRequest) HasName() bool`

HasName returns a boolean if a field has been set.

### SetNameNil

`func (o *GuardrailPolicyUpdateRequest) SetNameNil(b bool)`

 SetNameNil sets the value for Name to be an explicit nil

### UnsetName
`func (o *GuardrailPolicyUpdateRequest) UnsetName()`

UnsetName ensures that no value is present for Name, not even an explicit nil
### GetPolicy

`func (o *GuardrailPolicyUpdateRequest) GetPolicy() map[string]interface{}`

GetPolicy returns the Policy field if non-nil, zero value otherwise.

### GetPolicyOk

`func (o *GuardrailPolicyUpdateRequest) GetPolicyOk() (*map[string]interface{}, bool)`

GetPolicyOk returns a tuple with the Policy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicy

`func (o *GuardrailPolicyUpdateRequest) SetPolicy(v map[string]interface{})`

SetPolicy sets Policy field to given value.

### HasPolicy

`func (o *GuardrailPolicyUpdateRequest) HasPolicy() bool`

HasPolicy returns a boolean if a field has been set.

### SetPolicyNil

`func (o *GuardrailPolicyUpdateRequest) SetPolicyNil(b bool)`

 SetPolicyNil sets the value for Policy to be an explicit nil

### UnsetPolicy
`func (o *GuardrailPolicyUpdateRequest) UnsetPolicy()`

UnsetPolicy ensures that no value is present for Policy, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


