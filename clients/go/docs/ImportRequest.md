# ImportRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Yaml** | **string** |  | 
**ReferenceSources** | Pointer to [**[]ReferenceSource**](ReferenceSource.md) |  | [optional] 

## Methods

### NewImportRequest

`func NewImportRequest(yaml string, ) *ImportRequest`

NewImportRequest instantiates a new ImportRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewImportRequestWithDefaults

`func NewImportRequestWithDefaults() *ImportRequest`

NewImportRequestWithDefaults instantiates a new ImportRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetYaml

`func (o *ImportRequest) GetYaml() string`

GetYaml returns the Yaml field if non-nil, zero value otherwise.

### GetYamlOk

`func (o *ImportRequest) GetYamlOk() (*string, bool)`

GetYamlOk returns a tuple with the Yaml field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetYaml

`func (o *ImportRequest) SetYaml(v string)`

SetYaml sets Yaml field to given value.


### GetReferenceSources

`func (o *ImportRequest) GetReferenceSources() []ReferenceSource`

GetReferenceSources returns the ReferenceSources field if non-nil, zero value otherwise.

### GetReferenceSourcesOk

`func (o *ImportRequest) GetReferenceSourcesOk() (*[]ReferenceSource, bool)`

GetReferenceSourcesOk returns a tuple with the ReferenceSources field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReferenceSources

`func (o *ImportRequest) SetReferenceSources(v []ReferenceSource)`

SetReferenceSources sets ReferenceSources field to given value.

### HasReferenceSources

`func (o *ImportRequest) HasReferenceSources() bool`

HasReferenceSources returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


