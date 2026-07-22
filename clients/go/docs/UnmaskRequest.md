# UnmaskRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Text** | **string** |  | 
**MappingToken** | **string** |  | 
**ConsumeToken** | Pointer to **bool** |  | [optional] [default to true]

## Methods

### NewUnmaskRequest

`func NewUnmaskRequest(text string, mappingToken string, ) *UnmaskRequest`

NewUnmaskRequest instantiates a new UnmaskRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewUnmaskRequestWithDefaults

`func NewUnmaskRequestWithDefaults() *UnmaskRequest`

NewUnmaskRequestWithDefaults instantiates a new UnmaskRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetText

`func (o *UnmaskRequest) GetText() string`

GetText returns the Text field if non-nil, zero value otherwise.

### GetTextOk

`func (o *UnmaskRequest) GetTextOk() (*string, bool)`

GetTextOk returns a tuple with the Text field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetText

`func (o *UnmaskRequest) SetText(v string)`

SetText sets Text field to given value.


### GetMappingToken

`func (o *UnmaskRequest) GetMappingToken() string`

GetMappingToken returns the MappingToken field if non-nil, zero value otherwise.

### GetMappingTokenOk

`func (o *UnmaskRequest) GetMappingTokenOk() (*string, bool)`

GetMappingTokenOk returns a tuple with the MappingToken field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMappingToken

`func (o *UnmaskRequest) SetMappingToken(v string)`

SetMappingToken sets MappingToken field to given value.


### GetConsumeToken

`func (o *UnmaskRequest) GetConsumeToken() bool`

GetConsumeToken returns the ConsumeToken field if non-nil, zero value otherwise.

### GetConsumeTokenOk

`func (o *UnmaskRequest) GetConsumeTokenOk() (*bool, bool)`

GetConsumeTokenOk returns a tuple with the ConsumeToken field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConsumeToken

`func (o *UnmaskRequest) SetConsumeToken(v bool)`

SetConsumeToken sets ConsumeToken field to given value.

### HasConsumeToken

`func (o *UnmaskRequest) HasConsumeToken() bool`

HasConsumeToken returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


