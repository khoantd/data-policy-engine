# GuardrailsStatusResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Available** | **bool** |  | 
**Enabled** | **bool** |  | 
**OgrVersion** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewGuardrailsStatusResponse

`func NewGuardrailsStatusResponse(available bool, enabled bool, ) *GuardrailsStatusResponse`

NewGuardrailsStatusResponse instantiates a new GuardrailsStatusResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGuardrailsStatusResponseWithDefaults

`func NewGuardrailsStatusResponseWithDefaults() *GuardrailsStatusResponse`

NewGuardrailsStatusResponseWithDefaults instantiates a new GuardrailsStatusResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAvailable

`func (o *GuardrailsStatusResponse) GetAvailable() bool`

GetAvailable returns the Available field if non-nil, zero value otherwise.

### GetAvailableOk

`func (o *GuardrailsStatusResponse) GetAvailableOk() (*bool, bool)`

GetAvailableOk returns a tuple with the Available field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAvailable

`func (o *GuardrailsStatusResponse) SetAvailable(v bool)`

SetAvailable sets Available field to given value.


### GetEnabled

`func (o *GuardrailsStatusResponse) GetEnabled() bool`

GetEnabled returns the Enabled field if non-nil, zero value otherwise.

### GetEnabledOk

`func (o *GuardrailsStatusResponse) GetEnabledOk() (*bool, bool)`

GetEnabledOk returns a tuple with the Enabled field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnabled

`func (o *GuardrailsStatusResponse) SetEnabled(v bool)`

SetEnabled sets Enabled field to given value.


### GetOgrVersion

`func (o *GuardrailsStatusResponse) GetOgrVersion() string`

GetOgrVersion returns the OgrVersion field if non-nil, zero value otherwise.

### GetOgrVersionOk

`func (o *GuardrailsStatusResponse) GetOgrVersionOk() (*string, bool)`

GetOgrVersionOk returns a tuple with the OgrVersion field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOgrVersion

`func (o *GuardrailsStatusResponse) SetOgrVersion(v string)`

SetOgrVersion sets OgrVersion field to given value.

### HasOgrVersion

`func (o *GuardrailsStatusResponse) HasOgrVersion() bool`

HasOgrVersion returns a boolean if a field has been set.

### SetOgrVersionNil

`func (o *GuardrailsStatusResponse) SetOgrVersionNil(b bool)`

 SetOgrVersionNil sets the value for OgrVersion to be an explicit nil

### UnsetOgrVersion
`func (o *GuardrailsStatusResponse) UnsetOgrVersion()`

UnsetOgrVersion ensures that no value is present for OgrVersion, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


