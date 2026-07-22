# ValidateResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Valid** | **bool** |  | 
**Policy** | Pointer to [**NullablePolicy**](Policy.md) |  | [optional] 
**ClassificationPolicy** | Pointer to [**NullableClassificationPolicy**](ClassificationPolicy.md) |  | [optional] 
**PolicyKind** | Pointer to [**NullablePolicyKind**](PolicyKind.md) |  | [optional] 
**Errors** | Pointer to **[]string** |  | [optional] 

## Methods

### NewValidateResponse

`func NewValidateResponse(valid bool, ) *ValidateResponse`

NewValidateResponse instantiates a new ValidateResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewValidateResponseWithDefaults

`func NewValidateResponseWithDefaults() *ValidateResponse`

NewValidateResponseWithDefaults instantiates a new ValidateResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetValid

`func (o *ValidateResponse) GetValid() bool`

GetValid returns the Valid field if non-nil, zero value otherwise.

### GetValidOk

`func (o *ValidateResponse) GetValidOk() (*bool, bool)`

GetValidOk returns a tuple with the Valid field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetValid

`func (o *ValidateResponse) SetValid(v bool)`

SetValid sets Valid field to given value.


### GetPolicy

`func (o *ValidateResponse) GetPolicy() Policy`

GetPolicy returns the Policy field if non-nil, zero value otherwise.

### GetPolicyOk

`func (o *ValidateResponse) GetPolicyOk() (*Policy, bool)`

GetPolicyOk returns a tuple with the Policy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicy

`func (o *ValidateResponse) SetPolicy(v Policy)`

SetPolicy sets Policy field to given value.

### HasPolicy

`func (o *ValidateResponse) HasPolicy() bool`

HasPolicy returns a boolean if a field has been set.

### SetPolicyNil

`func (o *ValidateResponse) SetPolicyNil(b bool)`

 SetPolicyNil sets the value for Policy to be an explicit nil

### UnsetPolicy
`func (o *ValidateResponse) UnsetPolicy()`

UnsetPolicy ensures that no value is present for Policy, not even an explicit nil
### GetClassificationPolicy

`func (o *ValidateResponse) GetClassificationPolicy() ClassificationPolicy`

GetClassificationPolicy returns the ClassificationPolicy field if non-nil, zero value otherwise.

### GetClassificationPolicyOk

`func (o *ValidateResponse) GetClassificationPolicyOk() (*ClassificationPolicy, bool)`

GetClassificationPolicyOk returns a tuple with the ClassificationPolicy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetClassificationPolicy

`func (o *ValidateResponse) SetClassificationPolicy(v ClassificationPolicy)`

SetClassificationPolicy sets ClassificationPolicy field to given value.

### HasClassificationPolicy

`func (o *ValidateResponse) HasClassificationPolicy() bool`

HasClassificationPolicy returns a boolean if a field has been set.

### SetClassificationPolicyNil

`func (o *ValidateResponse) SetClassificationPolicyNil(b bool)`

 SetClassificationPolicyNil sets the value for ClassificationPolicy to be an explicit nil

### UnsetClassificationPolicy
`func (o *ValidateResponse) UnsetClassificationPolicy()`

UnsetClassificationPolicy ensures that no value is present for ClassificationPolicy, not even an explicit nil
### GetPolicyKind

`func (o *ValidateResponse) GetPolicyKind() PolicyKind`

GetPolicyKind returns the PolicyKind field if non-nil, zero value otherwise.

### GetPolicyKindOk

`func (o *ValidateResponse) GetPolicyKindOk() (*PolicyKind, bool)`

GetPolicyKindOk returns a tuple with the PolicyKind field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyKind

`func (o *ValidateResponse) SetPolicyKind(v PolicyKind)`

SetPolicyKind sets PolicyKind field to given value.

### HasPolicyKind

`func (o *ValidateResponse) HasPolicyKind() bool`

HasPolicyKind returns a boolean if a field has been set.

### SetPolicyKindNil

`func (o *ValidateResponse) SetPolicyKindNil(b bool)`

 SetPolicyKindNil sets the value for PolicyKind to be an explicit nil

### UnsetPolicyKind
`func (o *ValidateResponse) UnsetPolicyKind()`

UnsetPolicyKind ensures that no value is present for PolicyKind, not even an explicit nil
### GetErrors

`func (o *ValidateResponse) GetErrors() []string`

GetErrors returns the Errors field if non-nil, zero value otherwise.

### GetErrorsOk

`func (o *ValidateResponse) GetErrorsOk() (*[]string, bool)`

GetErrorsOk returns a tuple with the Errors field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetErrors

`func (o *ValidateResponse) SetErrors(v []string)`

SetErrors sets Errors field to given value.

### HasErrors

`func (o *ValidateResponse) HasErrors() bool`

HasErrors returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


