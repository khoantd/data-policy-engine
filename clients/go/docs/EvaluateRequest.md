# EvaluateRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Event** | [**GuardEventModel**](GuardEventModel.md) |  | 
**PolicyId** | Pointer to **NullableString** |  | [optional] 
**Policy** | Pointer to **map[string]interface{}** |  | [optional] 

## Methods

### NewEvaluateRequest

`func NewEvaluateRequest(event GuardEventModel, ) *EvaluateRequest`

NewEvaluateRequest instantiates a new EvaluateRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewEvaluateRequestWithDefaults

`func NewEvaluateRequestWithDefaults() *EvaluateRequest`

NewEvaluateRequestWithDefaults instantiates a new EvaluateRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetEvent

`func (o *EvaluateRequest) GetEvent() GuardEventModel`

GetEvent returns the Event field if non-nil, zero value otherwise.

### GetEventOk

`func (o *EvaluateRequest) GetEventOk() (*GuardEventModel, bool)`

GetEventOk returns a tuple with the Event field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEvent

`func (o *EvaluateRequest) SetEvent(v GuardEventModel)`

SetEvent sets Event field to given value.


### GetPolicyId

`func (o *EvaluateRequest) GetPolicyId() string`

GetPolicyId returns the PolicyId field if non-nil, zero value otherwise.

### GetPolicyIdOk

`func (o *EvaluateRequest) GetPolicyIdOk() (*string, bool)`

GetPolicyIdOk returns a tuple with the PolicyId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyId

`func (o *EvaluateRequest) SetPolicyId(v string)`

SetPolicyId sets PolicyId field to given value.

### HasPolicyId

`func (o *EvaluateRequest) HasPolicyId() bool`

HasPolicyId returns a boolean if a field has been set.

### SetPolicyIdNil

`func (o *EvaluateRequest) SetPolicyIdNil(b bool)`

 SetPolicyIdNil sets the value for PolicyId to be an explicit nil

### UnsetPolicyId
`func (o *EvaluateRequest) UnsetPolicyId()`

UnsetPolicyId ensures that no value is present for PolicyId, not even an explicit nil
### GetPolicy

`func (o *EvaluateRequest) GetPolicy() map[string]interface{}`

GetPolicy returns the Policy field if non-nil, zero value otherwise.

### GetPolicyOk

`func (o *EvaluateRequest) GetPolicyOk() (*map[string]interface{}, bool)`

GetPolicyOk returns a tuple with the Policy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicy

`func (o *EvaluateRequest) SetPolicy(v map[string]interface{})`

SetPolicy sets Policy field to given value.

### HasPolicy

`func (o *EvaluateRequest) HasPolicy() bool`

HasPolicy returns a boolean if a field has been set.

### SetPolicyNil

`func (o *EvaluateRequest) SetPolicyNil(b bool)`

 SetPolicyNil sets the value for Policy to be an explicit nil

### UnsetPolicy
`func (o *EvaluateRequest) UnsetPolicy()`

UnsetPolicy ensures that no value is present for Policy, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


