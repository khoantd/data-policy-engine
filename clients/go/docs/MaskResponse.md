# MaskResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**MaskedText** | Pointer to **NullableString** |  | [optional] 
**MaskedMessages** | Pointer to **[]map[string]string** |  | [optional] 
**MappingToken** | **string** |  | 
**EntityCount** | **int32** |  | 

## Methods

### NewMaskResponse

`func NewMaskResponse(mappingToken string, entityCount int32, ) *MaskResponse`

NewMaskResponse instantiates a new MaskResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewMaskResponseWithDefaults

`func NewMaskResponseWithDefaults() *MaskResponse`

NewMaskResponseWithDefaults instantiates a new MaskResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetMaskedText

`func (o *MaskResponse) GetMaskedText() string`

GetMaskedText returns the MaskedText field if non-nil, zero value otherwise.

### GetMaskedTextOk

`func (o *MaskResponse) GetMaskedTextOk() (*string, bool)`

GetMaskedTextOk returns a tuple with the MaskedText field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaskedText

`func (o *MaskResponse) SetMaskedText(v string)`

SetMaskedText sets MaskedText field to given value.

### HasMaskedText

`func (o *MaskResponse) HasMaskedText() bool`

HasMaskedText returns a boolean if a field has been set.

### SetMaskedTextNil

`func (o *MaskResponse) SetMaskedTextNil(b bool)`

 SetMaskedTextNil sets the value for MaskedText to be an explicit nil

### UnsetMaskedText
`func (o *MaskResponse) UnsetMaskedText()`

UnsetMaskedText ensures that no value is present for MaskedText, not even an explicit nil
### GetMaskedMessages

`func (o *MaskResponse) GetMaskedMessages() []map[string]string`

GetMaskedMessages returns the MaskedMessages field if non-nil, zero value otherwise.

### GetMaskedMessagesOk

`func (o *MaskResponse) GetMaskedMessagesOk() (*[]map[string]string, bool)`

GetMaskedMessagesOk returns a tuple with the MaskedMessages field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaskedMessages

`func (o *MaskResponse) SetMaskedMessages(v []map[string]string)`

SetMaskedMessages sets MaskedMessages field to given value.

### HasMaskedMessages

`func (o *MaskResponse) HasMaskedMessages() bool`

HasMaskedMessages returns a boolean if a field has been set.

### SetMaskedMessagesNil

`func (o *MaskResponse) SetMaskedMessagesNil(b bool)`

 SetMaskedMessagesNil sets the value for MaskedMessages to be an explicit nil

### UnsetMaskedMessages
`func (o *MaskResponse) UnsetMaskedMessages()`

UnsetMaskedMessages ensures that no value is present for MaskedMessages, not even an explicit nil
### GetMappingToken

`func (o *MaskResponse) GetMappingToken() string`

GetMappingToken returns the MappingToken field if non-nil, zero value otherwise.

### GetMappingTokenOk

`func (o *MaskResponse) GetMappingTokenOk() (*string, bool)`

GetMappingTokenOk returns a tuple with the MappingToken field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMappingToken

`func (o *MaskResponse) SetMappingToken(v string)`

SetMappingToken sets MappingToken field to given value.


### GetEntityCount

`func (o *MaskResponse) GetEntityCount() int32`

GetEntityCount returns the EntityCount field if non-nil, zero value otherwise.

### GetEntityCountOk

`func (o *MaskResponse) GetEntityCountOk() (*int32, bool)`

GetEntityCountOk returns a tuple with the EntityCount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEntityCount

`func (o *MaskResponse) SetEntityCount(v int32)`

SetEntityCount sets EntityCount field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


