# PolicyCreateRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Yaml** | Pointer to **NullableString** |  | [optional] 
**Policy** | Pointer to **map[string]interface{}** |  | [optional] 

## Methods

### NewPolicyCreateRequest

`func NewPolicyCreateRequest() *PolicyCreateRequest`

NewPolicyCreateRequest instantiates a new PolicyCreateRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPolicyCreateRequestWithDefaults

`func NewPolicyCreateRequestWithDefaults() *PolicyCreateRequest`

NewPolicyCreateRequestWithDefaults instantiates a new PolicyCreateRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetYaml

`func (o *PolicyCreateRequest) GetYaml() string`

GetYaml returns the Yaml field if non-nil, zero value otherwise.

### GetYamlOk

`func (o *PolicyCreateRequest) GetYamlOk() (*string, bool)`

GetYamlOk returns a tuple with the Yaml field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetYaml

`func (o *PolicyCreateRequest) SetYaml(v string)`

SetYaml sets Yaml field to given value.

### HasYaml

`func (o *PolicyCreateRequest) HasYaml() bool`

HasYaml returns a boolean if a field has been set.

### SetYamlNil

`func (o *PolicyCreateRequest) SetYamlNil(b bool)`

 SetYamlNil sets the value for Yaml to be an explicit nil

### UnsetYaml
`func (o *PolicyCreateRequest) UnsetYaml()`

UnsetYaml ensures that no value is present for Yaml, not even an explicit nil
### GetPolicy

`func (o *PolicyCreateRequest) GetPolicy() map[string]interface{}`

GetPolicy returns the Policy field if non-nil, zero value otherwise.

### GetPolicyOk

`func (o *PolicyCreateRequest) GetPolicyOk() (*map[string]interface{}, bool)`

GetPolicyOk returns a tuple with the Policy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicy

`func (o *PolicyCreateRequest) SetPolicy(v map[string]interface{})`

SetPolicy sets Policy field to given value.

### HasPolicy

`func (o *PolicyCreateRequest) HasPolicy() bool`

HasPolicy returns a boolean if a field has been set.

### SetPolicyNil

`func (o *PolicyCreateRequest) SetPolicyNil(b bool)`

 SetPolicyNil sets the value for Policy to be an explicit nil

### UnsetPolicy
`func (o *PolicyCreateRequest) UnsetPolicy()`

UnsetPolicy ensures that no value is present for Policy, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


