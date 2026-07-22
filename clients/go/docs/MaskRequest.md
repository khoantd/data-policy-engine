# MaskRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Text** | Pointer to **NullableString** |  | [optional] 
**Messages** | Pointer to **[]map[string]string** |  | [optional] 

## Methods

### NewMaskRequest

`func NewMaskRequest() *MaskRequest`

NewMaskRequest instantiates a new MaskRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewMaskRequestWithDefaults

`func NewMaskRequestWithDefaults() *MaskRequest`

NewMaskRequestWithDefaults instantiates a new MaskRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetText

`func (o *MaskRequest) GetText() string`

GetText returns the Text field if non-nil, zero value otherwise.

### GetTextOk

`func (o *MaskRequest) GetTextOk() (*string, bool)`

GetTextOk returns a tuple with the Text field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetText

`func (o *MaskRequest) SetText(v string)`

SetText sets Text field to given value.

### HasText

`func (o *MaskRequest) HasText() bool`

HasText returns a boolean if a field has been set.

### SetTextNil

`func (o *MaskRequest) SetTextNil(b bool)`

 SetTextNil sets the value for Text to be an explicit nil

### UnsetText
`func (o *MaskRequest) UnsetText()`

UnsetText ensures that no value is present for Text, not even an explicit nil
### GetMessages

`func (o *MaskRequest) GetMessages() []map[string]string`

GetMessages returns the Messages field if non-nil, zero value otherwise.

### GetMessagesOk

`func (o *MaskRequest) GetMessagesOk() (*[]map[string]string, bool)`

GetMessagesOk returns a tuple with the Messages field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMessages

`func (o *MaskRequest) SetMessages(v []map[string]string)`

SetMessages sets Messages field to given value.

### HasMessages

`func (o *MaskRequest) HasMessages() bool`

HasMessages returns a boolean if a field has been set.

### SetMessagesNil

`func (o *MaskRequest) SetMessagesNil(b bool)`

 SetMessagesNil sets the value for Messages to be an explicit nil

### UnsetMessages
`func (o *MaskRequest) UnsetMessages()`

UnsetMessages ensures that no value is present for Messages, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


