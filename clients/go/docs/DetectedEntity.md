# DetectedEntity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**EntityId** | **string** |  | 
**Label** | **string** |  | 
**Field** | **string** |  | 
**Classification** | [**DataClassification**](DataClassification.md) |  | 
**Sensitivity** | [**Sensitivity**](Sensitivity.md) |  | 
**Confidence** | Pointer to **string** |  | [optional] [default to "definitive"]
**Snippet** | Pointer to **NullableString** |  | [optional] 
**Detector** | **string** |  | 
**RegulatoryRefs** | Pointer to **[]string** |  | [optional] 

## Methods

### NewDetectedEntity

`func NewDetectedEntity(entityId string, label string, field string, classification DataClassification, sensitivity Sensitivity, detector string, ) *DetectedEntity`

NewDetectedEntity instantiates a new DetectedEntity object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDetectedEntityWithDefaults

`func NewDetectedEntityWithDefaults() *DetectedEntity`

NewDetectedEntityWithDefaults instantiates a new DetectedEntity object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetEntityId

`func (o *DetectedEntity) GetEntityId() string`

GetEntityId returns the EntityId field if non-nil, zero value otherwise.

### GetEntityIdOk

`func (o *DetectedEntity) GetEntityIdOk() (*string, bool)`

GetEntityIdOk returns a tuple with the EntityId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEntityId

`func (o *DetectedEntity) SetEntityId(v string)`

SetEntityId sets EntityId field to given value.


### GetLabel

`func (o *DetectedEntity) GetLabel() string`

GetLabel returns the Label field if non-nil, zero value otherwise.

### GetLabelOk

`func (o *DetectedEntity) GetLabelOk() (*string, bool)`

GetLabelOk returns a tuple with the Label field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLabel

`func (o *DetectedEntity) SetLabel(v string)`

SetLabel sets Label field to given value.


### GetField

`func (o *DetectedEntity) GetField() string`

GetField returns the Field field if non-nil, zero value otherwise.

### GetFieldOk

`func (o *DetectedEntity) GetFieldOk() (*string, bool)`

GetFieldOk returns a tuple with the Field field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetField

`func (o *DetectedEntity) SetField(v string)`

SetField sets Field field to given value.


### GetClassification

`func (o *DetectedEntity) GetClassification() DataClassification`

GetClassification returns the Classification field if non-nil, zero value otherwise.

### GetClassificationOk

`func (o *DetectedEntity) GetClassificationOk() (*DataClassification, bool)`

GetClassificationOk returns a tuple with the Classification field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetClassification

`func (o *DetectedEntity) SetClassification(v DataClassification)`

SetClassification sets Classification field to given value.


### GetSensitivity

`func (o *DetectedEntity) GetSensitivity() Sensitivity`

GetSensitivity returns the Sensitivity field if non-nil, zero value otherwise.

### GetSensitivityOk

`func (o *DetectedEntity) GetSensitivityOk() (*Sensitivity, bool)`

GetSensitivityOk returns a tuple with the Sensitivity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSensitivity

`func (o *DetectedEntity) SetSensitivity(v Sensitivity)`

SetSensitivity sets Sensitivity field to given value.


### GetConfidence

`func (o *DetectedEntity) GetConfidence() string`

GetConfidence returns the Confidence field if non-nil, zero value otherwise.

### GetConfidenceOk

`func (o *DetectedEntity) GetConfidenceOk() (*string, bool)`

GetConfidenceOk returns a tuple with the Confidence field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConfidence

`func (o *DetectedEntity) SetConfidence(v string)`

SetConfidence sets Confidence field to given value.

### HasConfidence

`func (o *DetectedEntity) HasConfidence() bool`

HasConfidence returns a boolean if a field has been set.

### GetSnippet

`func (o *DetectedEntity) GetSnippet() string`

GetSnippet returns the Snippet field if non-nil, zero value otherwise.

### GetSnippetOk

`func (o *DetectedEntity) GetSnippetOk() (*string, bool)`

GetSnippetOk returns a tuple with the Snippet field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSnippet

`func (o *DetectedEntity) SetSnippet(v string)`

SetSnippet sets Snippet field to given value.

### HasSnippet

`func (o *DetectedEntity) HasSnippet() bool`

HasSnippet returns a boolean if a field has been set.

### SetSnippetNil

`func (o *DetectedEntity) SetSnippetNil(b bool)`

 SetSnippetNil sets the value for Snippet to be an explicit nil

### UnsetSnippet
`func (o *DetectedEntity) UnsetSnippet()`

UnsetSnippet ensures that no value is present for Snippet, not even an explicit nil
### GetDetector

`func (o *DetectedEntity) GetDetector() string`

GetDetector returns the Detector field if non-nil, zero value otherwise.

### GetDetectorOk

`func (o *DetectedEntity) GetDetectorOk() (*string, bool)`

GetDetectorOk returns a tuple with the Detector field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDetector

`func (o *DetectedEntity) SetDetector(v string)`

SetDetector sets Detector field to given value.


### GetRegulatoryRefs

`func (o *DetectedEntity) GetRegulatoryRefs() []string`

GetRegulatoryRefs returns the RegulatoryRefs field if non-nil, zero value otherwise.

### GetRegulatoryRefsOk

`func (o *DetectedEntity) GetRegulatoryRefsOk() (*[]string, bool)`

GetRegulatoryRefsOk returns a tuple with the RegulatoryRefs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRegulatoryRefs

`func (o *DetectedEntity) SetRegulatoryRefs(v []string)`

SetRegulatoryRefs sets RegulatoryRefs field to given value.

### HasRegulatoryRefs

`func (o *DetectedEntity) HasRegulatoryRefs() bool`

HasRegulatoryRefs returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


