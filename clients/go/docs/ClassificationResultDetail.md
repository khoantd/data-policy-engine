# ClassificationResultDetail

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Action** | [**ClassificationAction**](ClassificationAction.md) |  | 
**Handling** | Pointer to **NullableString** |  | [optional] 
**MatchedPolicy** | Pointer to **NullableString** |  | [optional] 
**MatchedRule** | Pointer to **NullableString** |  | [optional] 
**PolicyVersion** | Pointer to **NullableInt32** |  | [optional] 
**MaxClassification** | Pointer to [**NullableDataClassification**](DataClassification.md) |  | [optional] 
**MaxSensitivity** | Pointer to [**NullableSensitivity**](Sensitivity.md) |  | [optional] 

## Methods

### NewClassificationResultDetail

`func NewClassificationResultDetail(action ClassificationAction, ) *ClassificationResultDetail`

NewClassificationResultDetail instantiates a new ClassificationResultDetail object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewClassificationResultDetailWithDefaults

`func NewClassificationResultDetailWithDefaults() *ClassificationResultDetail`

NewClassificationResultDetailWithDefaults instantiates a new ClassificationResultDetail object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAction

`func (o *ClassificationResultDetail) GetAction() ClassificationAction`

GetAction returns the Action field if non-nil, zero value otherwise.

### GetActionOk

`func (o *ClassificationResultDetail) GetActionOk() (*ClassificationAction, bool)`

GetActionOk returns a tuple with the Action field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAction

`func (o *ClassificationResultDetail) SetAction(v ClassificationAction)`

SetAction sets Action field to given value.


### GetHandling

`func (o *ClassificationResultDetail) GetHandling() string`

GetHandling returns the Handling field if non-nil, zero value otherwise.

### GetHandlingOk

`func (o *ClassificationResultDetail) GetHandlingOk() (*string, bool)`

GetHandlingOk returns a tuple with the Handling field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetHandling

`func (o *ClassificationResultDetail) SetHandling(v string)`

SetHandling sets Handling field to given value.

### HasHandling

`func (o *ClassificationResultDetail) HasHandling() bool`

HasHandling returns a boolean if a field has been set.

### SetHandlingNil

`func (o *ClassificationResultDetail) SetHandlingNil(b bool)`

 SetHandlingNil sets the value for Handling to be an explicit nil

### UnsetHandling
`func (o *ClassificationResultDetail) UnsetHandling()`

UnsetHandling ensures that no value is present for Handling, not even an explicit nil
### GetMatchedPolicy

`func (o *ClassificationResultDetail) GetMatchedPolicy() string`

GetMatchedPolicy returns the MatchedPolicy field if non-nil, zero value otherwise.

### GetMatchedPolicyOk

`func (o *ClassificationResultDetail) GetMatchedPolicyOk() (*string, bool)`

GetMatchedPolicyOk returns a tuple with the MatchedPolicy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMatchedPolicy

`func (o *ClassificationResultDetail) SetMatchedPolicy(v string)`

SetMatchedPolicy sets MatchedPolicy field to given value.

### HasMatchedPolicy

`func (o *ClassificationResultDetail) HasMatchedPolicy() bool`

HasMatchedPolicy returns a boolean if a field has been set.

### SetMatchedPolicyNil

`func (o *ClassificationResultDetail) SetMatchedPolicyNil(b bool)`

 SetMatchedPolicyNil sets the value for MatchedPolicy to be an explicit nil

### UnsetMatchedPolicy
`func (o *ClassificationResultDetail) UnsetMatchedPolicy()`

UnsetMatchedPolicy ensures that no value is present for MatchedPolicy, not even an explicit nil
### GetMatchedRule

`func (o *ClassificationResultDetail) GetMatchedRule() string`

GetMatchedRule returns the MatchedRule field if non-nil, zero value otherwise.

### GetMatchedRuleOk

`func (o *ClassificationResultDetail) GetMatchedRuleOk() (*string, bool)`

GetMatchedRuleOk returns a tuple with the MatchedRule field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMatchedRule

`func (o *ClassificationResultDetail) SetMatchedRule(v string)`

SetMatchedRule sets MatchedRule field to given value.

### HasMatchedRule

`func (o *ClassificationResultDetail) HasMatchedRule() bool`

HasMatchedRule returns a boolean if a field has been set.

### SetMatchedRuleNil

`func (o *ClassificationResultDetail) SetMatchedRuleNil(b bool)`

 SetMatchedRuleNil sets the value for MatchedRule to be an explicit nil

### UnsetMatchedRule
`func (o *ClassificationResultDetail) UnsetMatchedRule()`

UnsetMatchedRule ensures that no value is present for MatchedRule, not even an explicit nil
### GetPolicyVersion

`func (o *ClassificationResultDetail) GetPolicyVersion() int32`

GetPolicyVersion returns the PolicyVersion field if non-nil, zero value otherwise.

### GetPolicyVersionOk

`func (o *ClassificationResultDetail) GetPolicyVersionOk() (*int32, bool)`

GetPolicyVersionOk returns a tuple with the PolicyVersion field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyVersion

`func (o *ClassificationResultDetail) SetPolicyVersion(v int32)`

SetPolicyVersion sets PolicyVersion field to given value.

### HasPolicyVersion

`func (o *ClassificationResultDetail) HasPolicyVersion() bool`

HasPolicyVersion returns a boolean if a field has been set.

### SetPolicyVersionNil

`func (o *ClassificationResultDetail) SetPolicyVersionNil(b bool)`

 SetPolicyVersionNil sets the value for PolicyVersion to be an explicit nil

### UnsetPolicyVersion
`func (o *ClassificationResultDetail) UnsetPolicyVersion()`

UnsetPolicyVersion ensures that no value is present for PolicyVersion, not even an explicit nil
### GetMaxClassification

`func (o *ClassificationResultDetail) GetMaxClassification() DataClassification`

GetMaxClassification returns the MaxClassification field if non-nil, zero value otherwise.

### GetMaxClassificationOk

`func (o *ClassificationResultDetail) GetMaxClassificationOk() (*DataClassification, bool)`

GetMaxClassificationOk returns a tuple with the MaxClassification field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxClassification

`func (o *ClassificationResultDetail) SetMaxClassification(v DataClassification)`

SetMaxClassification sets MaxClassification field to given value.

### HasMaxClassification

`func (o *ClassificationResultDetail) HasMaxClassification() bool`

HasMaxClassification returns a boolean if a field has been set.

### SetMaxClassificationNil

`func (o *ClassificationResultDetail) SetMaxClassificationNil(b bool)`

 SetMaxClassificationNil sets the value for MaxClassification to be an explicit nil

### UnsetMaxClassification
`func (o *ClassificationResultDetail) UnsetMaxClassification()`

UnsetMaxClassification ensures that no value is present for MaxClassification, not even an explicit nil
### GetMaxSensitivity

`func (o *ClassificationResultDetail) GetMaxSensitivity() Sensitivity`

GetMaxSensitivity returns the MaxSensitivity field if non-nil, zero value otherwise.

### GetMaxSensitivityOk

`func (o *ClassificationResultDetail) GetMaxSensitivityOk() (*Sensitivity, bool)`

GetMaxSensitivityOk returns a tuple with the MaxSensitivity field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMaxSensitivity

`func (o *ClassificationResultDetail) SetMaxSensitivity(v Sensitivity)`

SetMaxSensitivity sets MaxSensitivity field to given value.

### HasMaxSensitivity

`func (o *ClassificationResultDetail) HasMaxSensitivity() bool`

HasMaxSensitivity returns a boolean if a field has been set.

### SetMaxSensitivityNil

`func (o *ClassificationResultDetail) SetMaxSensitivityNil(b bool)`

 SetMaxSensitivityNil sets the value for MaxSensitivity to be an explicit nil

### UnsetMaxSensitivity
`func (o *ClassificationResultDetail) UnsetMaxSensitivity()`

UnsetMaxSensitivity ensures that no value is present for MaxSensitivity, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


