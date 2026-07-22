# DsarConfig

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**RightToAccess** | Pointer to **bool** |  | [optional] [default to true]
**RightToErasure** | Pointer to **bool** |  | [optional] [default to true]
**ErasureExceptions** | Pointer to **[]string** |  | [optional] 
**ResponseDeadline** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewDsarConfig

`func NewDsarConfig() *DsarConfig`

NewDsarConfig instantiates a new DsarConfig object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDsarConfigWithDefaults

`func NewDsarConfigWithDefaults() *DsarConfig`

NewDsarConfigWithDefaults instantiates a new DsarConfig object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRightToAccess

`func (o *DsarConfig) GetRightToAccess() bool`

GetRightToAccess returns the RightToAccess field if non-nil, zero value otherwise.

### GetRightToAccessOk

`func (o *DsarConfig) GetRightToAccessOk() (*bool, bool)`

GetRightToAccessOk returns a tuple with the RightToAccess field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRightToAccess

`func (o *DsarConfig) SetRightToAccess(v bool)`

SetRightToAccess sets RightToAccess field to given value.

### HasRightToAccess

`func (o *DsarConfig) HasRightToAccess() bool`

HasRightToAccess returns a boolean if a field has been set.

### GetRightToErasure

`func (o *DsarConfig) GetRightToErasure() bool`

GetRightToErasure returns the RightToErasure field if non-nil, zero value otherwise.

### GetRightToErasureOk

`func (o *DsarConfig) GetRightToErasureOk() (*bool, bool)`

GetRightToErasureOk returns a tuple with the RightToErasure field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRightToErasure

`func (o *DsarConfig) SetRightToErasure(v bool)`

SetRightToErasure sets RightToErasure field to given value.

### HasRightToErasure

`func (o *DsarConfig) HasRightToErasure() bool`

HasRightToErasure returns a boolean if a field has been set.

### GetErasureExceptions

`func (o *DsarConfig) GetErasureExceptions() []string`

GetErasureExceptions returns the ErasureExceptions field if non-nil, zero value otherwise.

### GetErasureExceptionsOk

`func (o *DsarConfig) GetErasureExceptionsOk() (*[]string, bool)`

GetErasureExceptionsOk returns a tuple with the ErasureExceptions field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetErasureExceptions

`func (o *DsarConfig) SetErasureExceptions(v []string)`

SetErasureExceptions sets ErasureExceptions field to given value.

### HasErasureExceptions

`func (o *DsarConfig) HasErasureExceptions() bool`

HasErasureExceptions returns a boolean if a field has been set.

### GetResponseDeadline

`func (o *DsarConfig) GetResponseDeadline() string`

GetResponseDeadline returns the ResponseDeadline field if non-nil, zero value otherwise.

### GetResponseDeadlineOk

`func (o *DsarConfig) GetResponseDeadlineOk() (*string, bool)`

GetResponseDeadlineOk returns a tuple with the ResponseDeadline field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResponseDeadline

`func (o *DsarConfig) SetResponseDeadline(v string)`

SetResponseDeadline sets ResponseDeadline field to given value.

### HasResponseDeadline

`func (o *DsarConfig) HasResponseDeadline() bool`

HasResponseDeadline returns a boolean if a field has been set.

### SetResponseDeadlineNil

`func (o *DsarConfig) SetResponseDeadlineNil(b bool)`

 SetResponseDeadlineNil sets the value for ResponseDeadline to be an explicit nil

### UnsetResponseDeadline
`func (o *DsarConfig) UnsetResponseDeadline()`

UnsetResponseDeadline ensures that no value is present for ResponseDeadline, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


