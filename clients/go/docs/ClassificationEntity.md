# ClassificationEntity

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**Label** | **string** |  | 
**Classification** | [**DataClassification**](DataClassification.md) |  | 
**Sensitivity** | Pointer to [**Sensitivity**](Sensitivity.md) |  | [optional] 
**RegulatoryRefs** | Pointer to **[]string** |  | [optional] 
**Detection** | Pointer to [**EntityDetection**](EntityDetection.md) |  | [optional] 

## Methods

### NewClassificationEntity

`func NewClassificationEntity(id string, label string, classification DataClassification, ) *ClassificationEntity`

NewClassificationEntity instantiates a new ClassificationEntity object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewClassificationEntityWithDefaults

`func NewClassificationEntityWithDefaults() *ClassificationEntity`

NewClassificationEntityWithDefaults instantiates a new ClassificationEntity object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *ClassificationEntity) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *ClassificationEntity) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *ClassificationEntity) SetId(v string)`

SetId sets Id field to given value.


### GetLabel

`func (o *ClassificationEntity) GetLabel() string`

GetLabel returns the Label field if non-nil, zero value otherwise.

### GetLabelOk

`func (o *ClassificationEntity) GetLabelOk() (*string, bool)`

GetLabelOk returns a tuple with the Label field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLabel

`func (o *ClassificationEntity) SetLabel(v string)`

SetLabel sets Label field to given value.


### GetClassification

`func (o *ClassificationEntity) GetClassification() DataClassification`

GetClassification returns the Classification field if non-nil, zero value otherwise.

### GetClassificationOk

`func (o *ClassificationEntity) GetClassificationOk() (*DataClassification, bool)`

GetClassificationOk returns a tuple with the Classification field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetClassification

`func (o *ClassificationEntity) SetClassification(v DataClassification)`

SetClassification sets Classification field to given value.


### GetSensitivity

`func (o *ClassificationEntity) GetSensitivity() Sensitivity`

GetSensitivity returns the Sensitivity field if non-nil, zero value otherwise.

### GetSensitivityOk

`func (o *ClassificationEntity) GetSensitivityOk() (*Sensitivity, bool)`

GetSensitivityOk returns a tuple with the Sensitivity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSensitivity

`func (o *ClassificationEntity) SetSensitivity(v Sensitivity)`

SetSensitivity sets Sensitivity field to given value.

### HasSensitivity

`func (o *ClassificationEntity) HasSensitivity() bool`

HasSensitivity returns a boolean if a field has been set.

### GetRegulatoryRefs

`func (o *ClassificationEntity) GetRegulatoryRefs() []string`

GetRegulatoryRefs returns the RegulatoryRefs field if non-nil, zero value otherwise.

### GetRegulatoryRefsOk

`func (o *ClassificationEntity) GetRegulatoryRefsOk() (*[]string, bool)`

GetRegulatoryRefsOk returns a tuple with the RegulatoryRefs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRegulatoryRefs

`func (o *ClassificationEntity) SetRegulatoryRefs(v []string)`

SetRegulatoryRefs sets RegulatoryRefs field to given value.

### HasRegulatoryRefs

`func (o *ClassificationEntity) HasRegulatoryRefs() bool`

HasRegulatoryRefs returns a boolean if a field has been set.

### GetDetection

`func (o *ClassificationEntity) GetDetection() EntityDetection`

GetDetection returns the Detection field if non-nil, zero value otherwise.

### GetDetectionOk

`func (o *ClassificationEntity) GetDetectionOk() (*EntityDetection, bool)`

GetDetectionOk returns a tuple with the Detection field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDetection

`func (o *ClassificationEntity) SetDetection(v EntityDetection)`

SetDetection sets Detection field to given value.

### HasDetection

`func (o *ClassificationEntity) HasDetection() bool`

HasDetection returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


