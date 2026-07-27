# GuardrailPolicyCreateRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Name** | **string** |  | 
**Policy** | **map[string]interface{}** |  | 

## Methods

### NewGuardrailPolicyCreateRequest

`func NewGuardrailPolicyCreateRequest(name string, policy map[string]interface{}, ) *GuardrailPolicyCreateRequest`

NewGuardrailPolicyCreateRequest instantiates a new GuardrailPolicyCreateRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGuardrailPolicyCreateRequestWithDefaults

`func NewGuardrailPolicyCreateRequestWithDefaults() *GuardrailPolicyCreateRequest`

NewGuardrailPolicyCreateRequestWithDefaults instantiates a new GuardrailPolicyCreateRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetName

`func (o *GuardrailPolicyCreateRequest) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *GuardrailPolicyCreateRequest) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *GuardrailPolicyCreateRequest) SetName(v string)`

SetName sets Name field to given value.


### GetPolicy

`func (o *GuardrailPolicyCreateRequest) GetPolicy() map[string]interface{}`

GetPolicy returns the Policy field if non-nil, zero value otherwise.

### GetPolicyOk

`func (o *GuardrailPolicyCreateRequest) GetPolicyOk() (*map[string]interface{}, bool)`

GetPolicyOk returns a tuple with the Policy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicy

`func (o *GuardrailPolicyCreateRequest) SetPolicy(v map[string]interface{})`

SetPolicy sets Policy field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


