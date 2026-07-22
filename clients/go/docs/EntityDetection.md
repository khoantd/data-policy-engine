# EntityDetection

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**FieldNames** | Pointer to **[]string** |  | [optional] 
**Regex** | Pointer to **NullableString** |  | [optional] 
**NerTypes** | Pointer to **[]string** |  | [optional] 
**CatalogRef** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewEntityDetection

`func NewEntityDetection() *EntityDetection`

NewEntityDetection instantiates a new EntityDetection object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewEntityDetectionWithDefaults

`func NewEntityDetectionWithDefaults() *EntityDetection`

NewEntityDetectionWithDefaults instantiates a new EntityDetection object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetFieldNames

`func (o *EntityDetection) GetFieldNames() []string`

GetFieldNames returns the FieldNames field if non-nil, zero value otherwise.

### GetFieldNamesOk

`func (o *EntityDetection) GetFieldNamesOk() (*[]string, bool)`

GetFieldNamesOk returns a tuple with the FieldNames field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetFieldNames

`func (o *EntityDetection) SetFieldNames(v []string)`

SetFieldNames sets FieldNames field to given value.

### HasFieldNames

`func (o *EntityDetection) HasFieldNames() bool`

HasFieldNames returns a boolean if a field has been set.

### GetRegex

`func (o *EntityDetection) GetRegex() string`

GetRegex returns the Regex field if non-nil, zero value otherwise.

### GetRegexOk

`func (o *EntityDetection) GetRegexOk() (*string, bool)`

GetRegexOk returns a tuple with the Regex field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRegex

`func (o *EntityDetection) SetRegex(v string)`

SetRegex sets Regex field to given value.

### HasRegex

`func (o *EntityDetection) HasRegex() bool`

HasRegex returns a boolean if a field has been set.

### SetRegexNil

`func (o *EntityDetection) SetRegexNil(b bool)`

 SetRegexNil sets the value for Regex to be an explicit nil

### UnsetRegex
`func (o *EntityDetection) UnsetRegex()`

UnsetRegex ensures that no value is present for Regex, not even an explicit nil
### GetNerTypes

`func (o *EntityDetection) GetNerTypes() []string`

GetNerTypes returns the NerTypes field if non-nil, zero value otherwise.

### GetNerTypesOk

`func (o *EntityDetection) GetNerTypesOk() (*[]string, bool)`

GetNerTypesOk returns a tuple with the NerTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNerTypes

`func (o *EntityDetection) SetNerTypes(v []string)`

SetNerTypes sets NerTypes field to given value.

### HasNerTypes

`func (o *EntityDetection) HasNerTypes() bool`

HasNerTypes returns a boolean if a field has been set.

### GetCatalogRef

`func (o *EntityDetection) GetCatalogRef() string`

GetCatalogRef returns the CatalogRef field if non-nil, zero value otherwise.

### GetCatalogRefOk

`func (o *EntityDetection) GetCatalogRefOk() (*string, bool)`

GetCatalogRefOk returns a tuple with the CatalogRef field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCatalogRef

`func (o *EntityDetection) SetCatalogRef(v string)`

SetCatalogRef sets CatalogRef field to given value.

### HasCatalogRef

`func (o *EntityDetection) HasCatalogRef() bool`

HasCatalogRef returns a boolean if a field has been set.

### SetCatalogRefNil

`func (o *EntityDetection) SetCatalogRefNil(b bool)`

 SetCatalogRefNil sets the value for CatalogRef to be an explicit nil

### UnsetCatalogRef
`func (o *EntityDetection) UnsetCatalogRef()`

UnsetCatalogRef ensures that no value is present for CatalogRef, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


