# ClassificationRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**DataType** | **string** |  | 
**RecordId** | **string** |  | 
**Metadata** | Pointer to **map[string]interface{}** |  | [optional] 
**Source** | Pointer to **NullableString** |  | [optional] 
**Jurisdiction** | Pointer to **NullableString** |  | [optional] 
**TextFields** | Pointer to **[]string** |  | [optional] 
**PolicyId** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewClassificationRequest

`func NewClassificationRequest(dataType string, recordId string, ) *ClassificationRequest`

NewClassificationRequest instantiates a new ClassificationRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewClassificationRequestWithDefaults

`func NewClassificationRequestWithDefaults() *ClassificationRequest`

NewClassificationRequestWithDefaults instantiates a new ClassificationRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetDataType

`func (o *ClassificationRequest) GetDataType() string`

GetDataType returns the DataType field if non-nil, zero value otherwise.

### GetDataTypeOk

`func (o *ClassificationRequest) GetDataTypeOk() (*string, bool)`

GetDataTypeOk returns a tuple with the DataType field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDataType

`func (o *ClassificationRequest) SetDataType(v string)`

SetDataType sets DataType field to given value.


### GetRecordId

`func (o *ClassificationRequest) GetRecordId() string`

GetRecordId returns the RecordId field if non-nil, zero value otherwise.

### GetRecordIdOk

`func (o *ClassificationRequest) GetRecordIdOk() (*string, bool)`

GetRecordIdOk returns a tuple with the RecordId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecordId

`func (o *ClassificationRequest) SetRecordId(v string)`

SetRecordId sets RecordId field to given value.


### GetMetadata

`func (o *ClassificationRequest) GetMetadata() map[string]interface{}`

GetMetadata returns the Metadata field if non-nil, zero value otherwise.

### GetMetadataOk

`func (o *ClassificationRequest) GetMetadataOk() (*map[string]interface{}, bool)`

GetMetadataOk returns a tuple with the Metadata field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMetadata

`func (o *ClassificationRequest) SetMetadata(v map[string]interface{})`

SetMetadata sets Metadata field to given value.

### HasMetadata

`func (o *ClassificationRequest) HasMetadata() bool`

HasMetadata returns a boolean if a field has been set.

### GetSource

`func (o *ClassificationRequest) GetSource() string`

GetSource returns the Source field if non-nil, zero value otherwise.

### GetSourceOk

`func (o *ClassificationRequest) GetSourceOk() (*string, bool)`

GetSourceOk returns a tuple with the Source field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSource

`func (o *ClassificationRequest) SetSource(v string)`

SetSource sets Source field to given value.

### HasSource

`func (o *ClassificationRequest) HasSource() bool`

HasSource returns a boolean if a field has been set.

### SetSourceNil

`func (o *ClassificationRequest) SetSourceNil(b bool)`

 SetSourceNil sets the value for Source to be an explicit nil

### UnsetSource
`func (o *ClassificationRequest) UnsetSource()`

UnsetSource ensures that no value is present for Source, not even an explicit nil
### GetJurisdiction

`func (o *ClassificationRequest) GetJurisdiction() string`

GetJurisdiction returns the Jurisdiction field if non-nil, zero value otherwise.

### GetJurisdictionOk

`func (o *ClassificationRequest) GetJurisdictionOk() (*string, bool)`

GetJurisdictionOk returns a tuple with the Jurisdiction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetJurisdiction

`func (o *ClassificationRequest) SetJurisdiction(v string)`

SetJurisdiction sets Jurisdiction field to given value.

### HasJurisdiction

`func (o *ClassificationRequest) HasJurisdiction() bool`

HasJurisdiction returns a boolean if a field has been set.

### SetJurisdictionNil

`func (o *ClassificationRequest) SetJurisdictionNil(b bool)`

 SetJurisdictionNil sets the value for Jurisdiction to be an explicit nil

### UnsetJurisdiction
`func (o *ClassificationRequest) UnsetJurisdiction()`

UnsetJurisdiction ensures that no value is present for Jurisdiction, not even an explicit nil
### GetTextFields

`func (o *ClassificationRequest) GetTextFields() []string`

GetTextFields returns the TextFields field if non-nil, zero value otherwise.

### GetTextFieldsOk

`func (o *ClassificationRequest) GetTextFieldsOk() (*[]string, bool)`

GetTextFieldsOk returns a tuple with the TextFields field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTextFields

`func (o *ClassificationRequest) SetTextFields(v []string)`

SetTextFields sets TextFields field to given value.

### HasTextFields

`func (o *ClassificationRequest) HasTextFields() bool`

HasTextFields returns a boolean if a field has been set.

### SetTextFieldsNil

`func (o *ClassificationRequest) SetTextFieldsNil(b bool)`

 SetTextFieldsNil sets the value for TextFields to be an explicit nil

### UnsetTextFields
`func (o *ClassificationRequest) UnsetTextFields()`

UnsetTextFields ensures that no value is present for TextFields, not even an explicit nil
### GetPolicyId

`func (o *ClassificationRequest) GetPolicyId() string`

GetPolicyId returns the PolicyId field if non-nil, zero value otherwise.

### GetPolicyIdOk

`func (o *ClassificationRequest) GetPolicyIdOk() (*string, bool)`

GetPolicyIdOk returns a tuple with the PolicyId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyId

`func (o *ClassificationRequest) SetPolicyId(v string)`

SetPolicyId sets PolicyId field to given value.

### HasPolicyId

`func (o *ClassificationRequest) HasPolicyId() bool`

HasPolicyId returns a boolean if a field has been set.

### SetPolicyIdNil

`func (o *ClassificationRequest) SetPolicyIdNil(b bool)`

 SetPolicyIdNil sets the value for PolicyId to be an explicit nil

### UnsetPolicyId
`func (o *ClassificationRequest) UnsetPolicyId()`

UnsetPolicyId ensures that no value is present for PolicyId, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


