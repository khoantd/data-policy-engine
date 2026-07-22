# RecordRef

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**RecordId** | **string** |  | 
**DataType** | **string** |  | 
**Metadata** | Pointer to **map[string]interface{}** |  | [optional] 
**Source** | Pointer to **NullableString** |  | [optional] 
**Jurisdiction** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewRecordRef

`func NewRecordRef(recordId string, dataType string, ) *RecordRef`

NewRecordRef instantiates a new RecordRef object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewRecordRefWithDefaults

`func NewRecordRefWithDefaults() *RecordRef`

NewRecordRefWithDefaults instantiates a new RecordRef object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRecordId

`func (o *RecordRef) GetRecordId() string`

GetRecordId returns the RecordId field if non-nil, zero value otherwise.

### GetRecordIdOk

`func (o *RecordRef) GetRecordIdOk() (*string, bool)`

GetRecordIdOk returns a tuple with the RecordId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecordId

`func (o *RecordRef) SetRecordId(v string)`

SetRecordId sets RecordId field to given value.


### GetDataType

`func (o *RecordRef) GetDataType() string`

GetDataType returns the DataType field if non-nil, zero value otherwise.

### GetDataTypeOk

`func (o *RecordRef) GetDataTypeOk() (*string, bool)`

GetDataTypeOk returns a tuple with the DataType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDataType

`func (o *RecordRef) SetDataType(v string)`

SetDataType sets DataType field to given value.


### GetMetadata

`func (o *RecordRef) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *RecordRef) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *RecordRef) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *RecordRef) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetSource

`func (o *RecordRef) GetSource() string`

GetSource returns the Source field if non-nil, zero value otherwise.

### GetSourceOk

`func (o *RecordRef) GetSourceOk() (*string, bool)`

GetSourceOk returns a tuple with the Source field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSource

`func (o *RecordRef) SetSource(v string)`

SetSource sets Source field to given value.

### HasSource

`func (o *RecordRef) HasSource() bool`

HasSource returns a boolean if a field has been set.

### SetSourceNil

`func (o *RecordRef) SetSourceNil(b bool)`

 SetSourceNil sets the value for Source to be an explicit nil

### UnsetSource
`func (o *RecordRef) UnsetSource()`

UnsetSource ensures that no value is present for Source, not even an explicit nil
### GetJurisdiction

`func (o *RecordRef) GetJurisdiction() string`

GetJurisdiction returns the Jurisdiction field if non-nil, zero value otherwise.

### GetJurisdictionOk

`func (o *RecordRef) GetJurisdictionOk() (*string, bool)`

GetJurisdictionOk returns a tuple with the Jurisdiction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetJurisdiction

`func (o *RecordRef) SetJurisdiction(v string)`

SetJurisdiction sets Jurisdiction field to given value.

### HasJurisdiction

`func (o *RecordRef) HasJurisdiction() bool`

HasJurisdiction returns a boolean if a field has been set.

### SetJurisdictionNil

`func (o *RecordRef) SetJurisdictionNil(b bool)`

 SetJurisdictionNil sets the value for Jurisdiction to be an explicit nil

### UnsetJurisdiction
`func (o *RecordRef) UnsetJurisdiction()`

UnsetJurisdiction ensures that no value is present for Jurisdiction, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


