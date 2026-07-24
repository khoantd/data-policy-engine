# ReferenceSource

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **int32** |  | 
**Title** | **string** |  | 
**Url** | **string** |  | 
**Snippet** | Pointer to **string** |  | [optional] [default to ""]
**Domain** | Pointer to **string** |  | [optional] [default to ""]

## Methods

### NewReferenceSource

`func NewReferenceSource(id int32, title string, url string, ) *ReferenceSource`

NewReferenceSource instantiates a new ReferenceSource object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewReferenceSourceWithDefaults

`func NewReferenceSourceWithDefaults() *ReferenceSource`

NewReferenceSourceWithDefaults instantiates a new ReferenceSource object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *ReferenceSource) GetId() int32`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *ReferenceSource) GetIdOk() (*int32, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *ReferenceSource) SetId(v int32)`

SetId sets Id field to given value.


### GetTitle

`func (o *ReferenceSource) GetTitle() string`

GetTitle returns the Title field if non-nil, zero value otherwise.

### GetTitleOk

`func (o *ReferenceSource) GetTitleOk() (*string, bool)`

GetTitleOk returns a tuple with the Title field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTitle

`func (o *ReferenceSource) SetTitle(v string)`

SetTitle sets Title field to given value.


### GetUrl

`func (o *ReferenceSource) GetUrl() string`

GetUrl returns the Url field if non-nil, zero value otherwise.

### GetUrlOk

`func (o *ReferenceSource) GetUrlOk() (*string, bool)`

GetUrlOk returns a tuple with the Url field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUrl

`func (o *ReferenceSource) SetUrl(v string)`

SetUrl sets Url field to given value.


### GetSnippet

`func (o *ReferenceSource) GetSnippet() string`

GetSnippet returns the Snippet field if non-nil, zero value otherwise.

### GetSnippetOk

`func (o *ReferenceSource) GetSnippetOk() (*string, bool)`

GetSnippetOk returns a tuple with the Snippet field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSnippet

`func (o *ReferenceSource) SetSnippet(v string)`

SetSnippet sets Snippet field to given value.

### HasSnippet

`func (o *ReferenceSource) HasSnippet() bool`

HasSnippet returns a boolean if a field has been set.

### GetDomain

`func (o *ReferenceSource) GetDomain() string`

GetDomain returns the Domain field if non-nil, zero value otherwise.

### GetDomainOk

`func (o *ReferenceSource) GetDomainOk() (*string, bool)`

GetDomainOk returns a tuple with the Domain field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDomain

`func (o *ReferenceSource) SetDomain(v string)`

SetDomain sets Domain field to given value.

### HasDomain

`func (o *ReferenceSource) HasDomain() bool`

HasDomain returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


