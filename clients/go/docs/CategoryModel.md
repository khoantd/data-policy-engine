# CategoryModel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**Domain** | **string** |  | 
**Score** | Pointer to **float32** |  | [optional] [default to 1.0]

## Methods

### NewCategoryModel

`func NewCategoryModel(id string, domain string, ) *CategoryModel`

NewCategoryModel instantiates a new CategoryModel object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewCategoryModelWithDefaults

`func NewCategoryModelWithDefaults() *CategoryModel`

NewCategoryModelWithDefaults instantiates a new CategoryModel object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *CategoryModel) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *CategoryModel) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *CategoryModel) SetId(v string)`

SetId sets Id field to given value.


### GetDomain

`func (o *CategoryModel) GetDomain() string`

GetDomain returns the Domain field if non-nil, zero value otherwise.

### GetDomainOk

`func (o *CategoryModel) GetDomainOk() (*string, bool)`

GetDomainOk returns a tuple with the Domain field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDomain

`func (o *CategoryModel) SetDomain(v string)`

SetDomain sets Domain field to given value.


### GetScore

`func (o *CategoryModel) GetScore() float32`

GetScore returns the Score field if non-nil, zero value otherwise.

### GetScoreOk

`func (o *CategoryModel) GetScoreOk() (*float32, bool)`

GetScoreOk returns a tuple with the Score field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScore

`func (o *CategoryModel) SetScore(v float32)`

SetScore sets Score field to given value.

### HasScore

`func (o *CategoryModel) HasScore() bool`

HasScore returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


