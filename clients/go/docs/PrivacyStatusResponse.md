# PrivacyStatusResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Available** | **bool** |  | 
**Enabled** | **bool** |  | 
**ModelSize** | Pointer to **NullableString** |  | [optional] 
**Languages** | Pointer to **[]string** |  | [optional] 

## Methods

### NewPrivacyStatusResponse

`func NewPrivacyStatusResponse(available bool, enabled bool, ) *PrivacyStatusResponse`

NewPrivacyStatusResponse instantiates a new PrivacyStatusResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPrivacyStatusResponseWithDefaults

`func NewPrivacyStatusResponseWithDefaults() *PrivacyStatusResponse`

NewPrivacyStatusResponseWithDefaults instantiates a new PrivacyStatusResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAvailable

`func (o *PrivacyStatusResponse) GetAvailable() bool`

GetAvailable returns the Available field if non-nil, zero value otherwise.

### GetAvailableOk

`func (o *PrivacyStatusResponse) GetAvailableOk() (*bool, bool)`

GetAvailableOk returns a tuple with the Available field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAvailable

`func (o *PrivacyStatusResponse) SetAvailable(v bool)`

SetAvailable sets Available field to given value.


### GetEnabled

`func (o *PrivacyStatusResponse) GetEnabled() bool`

GetEnabled returns the Enabled field if non-nil, zero value otherwise.

### GetEnabledOk

`func (o *PrivacyStatusResponse) GetEnabledOk() (*bool, bool)`

GetEnabledOk returns a tuple with the Enabled field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEnabled

`func (o *PrivacyStatusResponse) SetEnabled(v bool)`

SetEnabled sets Enabled field to given value.


### GetModelSize

`func (o *PrivacyStatusResponse) GetModelSize() string`

GetModelSize returns the ModelSize field if non-nil, zero value otherwise.

### GetModelSizeOk

`func (o *PrivacyStatusResponse) GetModelSizeOk() (*string, bool)`

GetModelSizeOk returns a tuple with the ModelSize field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetModelSize

`func (o *PrivacyStatusResponse) SetModelSize(v string)`

SetModelSize sets ModelSize field to given value.

### HasModelSize

`func (o *PrivacyStatusResponse) HasModelSize() bool`

HasModelSize returns a boolean if a field has been set.

### SetModelSizeNil

`func (o *PrivacyStatusResponse) SetModelSizeNil(b bool)`

 SetModelSizeNil sets the value for ModelSize to be an explicit nil

### UnsetModelSize
`func (o *PrivacyStatusResponse) UnsetModelSize()`

UnsetModelSize ensures that no value is present for ModelSize, not even an explicit nil
### GetLanguages

`func (o *PrivacyStatusResponse) GetLanguages() []string`

GetLanguages returns the Languages field if non-nil, zero value otherwise.

### GetLanguagesOk

`func (o *PrivacyStatusResponse) GetLanguagesOk() (*[]string, bool)`

GetLanguagesOk returns a tuple with the Languages field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLanguages

`func (o *PrivacyStatusResponse) SetLanguages(v []string)`

SetLanguages sets Languages field to given value.

### HasLanguages

`func (o *PrivacyStatusResponse) HasLanguages() bool`

HasLanguages returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


