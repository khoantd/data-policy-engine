# ProvenanceModel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Source** | **string** |  | 
**Trust** | **string** |  | 
**Ref** | Pointer to **NullableString** |  | [optional] 
**TaintTags** | Pointer to **[]string** |  | [optional] 

## Methods

### NewProvenanceModel

`func NewProvenanceModel(source string, trust string, ) *ProvenanceModel`

NewProvenanceModel instantiates a new ProvenanceModel object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewProvenanceModelWithDefaults

`func NewProvenanceModelWithDefaults() *ProvenanceModel`

NewProvenanceModelWithDefaults instantiates a new ProvenanceModel object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSource

`func (o *ProvenanceModel) GetSource() string`

GetSource returns the Source field if non-nil, zero value otherwise.

### GetSourceOk

`func (o *ProvenanceModel) GetSourceOk() (*string, bool)`

GetSourceOk returns a tuple with the Source field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSource

`func (o *ProvenanceModel) SetSource(v string)`

SetSource sets Source field to given value.


### GetTrust

`func (o *ProvenanceModel) GetTrust() string`

GetTrust returns the Trust field if non-nil, zero value otherwise.

### GetTrustOk

`func (o *ProvenanceModel) GetTrustOk() (*string, bool)`

GetTrustOk returns a tuple with the Trust field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTrust

`func (o *ProvenanceModel) SetTrust(v string)`

SetTrust sets Trust field to given value.


### GetRef

`func (o *ProvenanceModel) GetRef() string`

GetRef returns the Ref field if non-nil, zero value otherwise.

### GetRefOk

`func (o *ProvenanceModel) GetRefOk() (*string, bool)`

GetRefOk returns a tuple with the Ref field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRef

`func (o *ProvenanceModel) SetRef(v string)`

SetRef sets Ref field to given value.

### HasRef

`func (o *ProvenanceModel) HasRef() bool`

HasRef returns a boolean if a field has been set.

### SetRefNil

`func (o *ProvenanceModel) SetRefNil(b bool)`

 SetRefNil sets the value for Ref to be an explicit nil

### UnsetRef
`func (o *ProvenanceModel) UnsetRef()`

UnsetRef ensures that no value is present for Ref, not even an explicit nil
### GetTaintTags

`func (o *ProvenanceModel) GetTaintTags() []string`

GetTaintTags returns the TaintTags field if non-nil, zero value otherwise.

### GetTaintTagsOk

`func (o *ProvenanceModel) GetTaintTagsOk() (*[]string, bool)`

GetTaintTagsOk returns a tuple with the TaintTags field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTaintTags

`func (o *ProvenanceModel) SetTaintTags(v []string)`

SetTaintTags sets TaintTags field to given value.

### HasTaintTags

`func (o *ProvenanceModel) HasTaintTags() bool`

HasTaintTags returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


