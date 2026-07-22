# EvaluationResultDetail

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Action** | [**Action**](Action.md) |  | 
**MatchedPolicy** | Pointer to **NullableString** |  | [optional] 
**MatchedRule** | Pointer to **NullableString** |  | [optional] 
**PolicyVersion** | Pointer to **NullableInt32** |  | [optional] 
**GracePeriodEnds** | Pointer to **NullableString** |  | [optional] 
**NotifyAt** | Pointer to **NullableString** |  | [optional] 
**RequiresApproval** | Pointer to **bool** |  | [optional] [default to false]
**Confidence** | Pointer to **string** |  | [optional] [default to "none"]
**ArchiveTarget** | Pointer to **NullableString** |  | [optional] 
**RetainUntil** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewEvaluationResultDetail

`func NewEvaluationResultDetail(action Action, ) *EvaluationResultDetail`

NewEvaluationResultDetail instantiates a new EvaluationResultDetail object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewEvaluationResultDetailWithDefaults

`func NewEvaluationResultDetailWithDefaults() *EvaluationResultDetail`

NewEvaluationResultDetailWithDefaults instantiates a new EvaluationResultDetail object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAction

`func (o *EvaluationResultDetail) GetAction() Action`

GetAction returns the Action field if non-nil, zero value otherwise.

### GetActionOk

`func (o *EvaluationResultDetail) GetActionOk() (*Action, bool)`

GetActionOk returns a tuple with the Action field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAction

`func (o *EvaluationResultDetail) SetAction(v Action)`

SetAction sets Action field to given value.


### GetMatchedPolicy

`func (o *EvaluationResultDetail) GetMatchedPolicy() string`

GetMatchedPolicy returns the MatchedPolicy field if non-nil, zero value otherwise.

### GetMatchedPolicyOk

`func (o *EvaluationResultDetail) GetMatchedPolicyOk() (*string, bool)`

GetMatchedPolicyOk returns a tuple with the MatchedPolicy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMatchedPolicy

`func (o *EvaluationResultDetail) SetMatchedPolicy(v string)`

SetMatchedPolicy sets MatchedPolicy field to given value.

### HasMatchedPolicy

`func (o *EvaluationResultDetail) HasMatchedPolicy() bool`

HasMatchedPolicy returns a boolean if a field has been set.

### SetMatchedPolicyNil

`func (o *EvaluationResultDetail) SetMatchedPolicyNil(b bool)`

 SetMatchedPolicyNil sets the value for MatchedPolicy to be an explicit nil

### UnsetMatchedPolicy
`func (o *EvaluationResultDetail) UnsetMatchedPolicy()`

UnsetMatchedPolicy ensures that no value is present for MatchedPolicy, not even an explicit nil
### GetMatchedRule

`func (o *EvaluationResultDetail) GetMatchedRule() string`

GetMatchedRule returns the MatchedRule field if non-nil, zero value otherwise.

### GetMatchedRuleOk

`func (o *EvaluationResultDetail) GetMatchedRuleOk() (*string, bool)`

GetMatchedRuleOk returns a tuple with the MatchedRule field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetMatchedRule

`func (o *EvaluationResultDetail) SetMatchedRule(v string)`

SetMatchedRule sets MatchedRule field to given value.

### HasMatchedRule

`func (o *EvaluationResultDetail) HasMatchedRule() bool`

HasMatchedRule returns a boolean if a field has been set.

### SetMatchedRuleNil

`func (o *EvaluationResultDetail) SetMatchedRuleNil(b bool)`

 SetMatchedRuleNil sets the value for MatchedRule to be an explicit nil

### UnsetMatchedRule
`func (o *EvaluationResultDetail) UnsetMatchedRule()`

UnsetMatchedRule ensures that no value is present for MatchedRule, not even an explicit nil
### GetPolicyVersion

`func (o *EvaluationResultDetail) GetPolicyVersion() int32`

GetPolicyVersion returns the PolicyVersion field if non-nil, zero value otherwise.

### GetPolicyVersionOk

`func (o *EvaluationResultDetail) GetPolicyVersionOk() (*int32, bool)`

GetPolicyVersionOk returns a tuple with the PolicyVersion field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyVersion

`func (o *EvaluationResultDetail) SetPolicyVersion(v int32)`

SetPolicyVersion sets PolicyVersion field to given value.

### HasPolicyVersion

`func (o *EvaluationResultDetail) HasPolicyVersion() bool`

HasPolicyVersion returns a boolean if a field has been set.

### SetPolicyVersionNil

`func (o *EvaluationResultDetail) SetPolicyVersionNil(b bool)`

 SetPolicyVersionNil sets the value for PolicyVersion to be an explicit nil

### UnsetPolicyVersion
`func (o *EvaluationResultDetail) UnsetPolicyVersion()`

UnsetPolicyVersion ensures that no value is present for PolicyVersion, not even an explicit nil
### GetGracePeriodEnds

`func (o *EvaluationResultDetail) GetGracePeriodEnds() string`

GetGracePeriodEnds returns the GracePeriodEnds field if non-nil, zero value otherwise.

### GetGracePeriodEndsOk

`func (o *EvaluationResultDetail) GetGracePeriodEndsOk() (*string, bool)`

GetGracePeriodEndsOk returns a tuple with the GracePeriodEnds field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGracePeriodEnds

`func (o *EvaluationResultDetail) SetGracePeriodEnds(v string)`

SetGracePeriodEnds sets GracePeriodEnds field to given value.

### HasGracePeriodEnds

`func (o *EvaluationResultDetail) HasGracePeriodEnds() bool`

HasGracePeriodEnds returns a boolean if a field has been set.

### SetGracePeriodEndsNil

`func (o *EvaluationResultDetail) SetGracePeriodEndsNil(b bool)`

 SetGracePeriodEndsNil sets the value for GracePeriodEnds to be an explicit nil

### UnsetGracePeriodEnds
`func (o *EvaluationResultDetail) UnsetGracePeriodEnds()`

UnsetGracePeriodEnds ensures that no value is present for GracePeriodEnds, not even an explicit nil
### GetNotifyAt

`func (o *EvaluationResultDetail) GetNotifyAt() string`

GetNotifyAt returns the NotifyAt field if non-nil, zero value otherwise.

### GetNotifyAtOk

`func (o *EvaluationResultDetail) GetNotifyAtOk() (*string, bool)`

GetNotifyAtOk returns a tuple with the NotifyAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNotifyAt

`func (o *EvaluationResultDetail) SetNotifyAt(v string)`

SetNotifyAt sets NotifyAt field to given value.

### HasNotifyAt

`func (o *EvaluationResultDetail) HasNotifyAt() bool`

HasNotifyAt returns a boolean if a field has been set.

### SetNotifyAtNil

`func (o *EvaluationResultDetail) SetNotifyAtNil(b bool)`

 SetNotifyAtNil sets the value for NotifyAt to be an explicit nil

### UnsetNotifyAt
`func (o *EvaluationResultDetail) UnsetNotifyAt()`

UnsetNotifyAt ensures that no value is present for NotifyAt, not even an explicit nil
### GetRequiresApproval

`func (o *EvaluationResultDetail) GetRequiresApproval() bool`

GetRequiresApproval returns the RequiresApproval field if non-nil, zero value otherwise.

### GetRequiresApprovalOk

`func (o *EvaluationResultDetail) GetRequiresApprovalOk() (*bool, bool)`

GetRequiresApprovalOk returns a tuple with the RequiresApproval field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequiresApproval

`func (o *EvaluationResultDetail) SetRequiresApproval(v bool)`

SetRequiresApproval sets RequiresApproval field to given value.

### HasRequiresApproval

`func (o *EvaluationResultDetail) HasRequiresApproval() bool`

HasRequiresApproval returns a boolean if a field has been set.

### GetConfidence

`func (o *EvaluationResultDetail) GetConfidence() string`

GetConfidence returns the Confidence field if non-nil, zero value otherwise.

### GetConfidenceOk

`func (o *EvaluationResultDetail) GetConfidenceOk() (*string, bool)`

GetConfidenceOk returns a tuple with the Confidence field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConfidence

`func (o *EvaluationResultDetail) SetConfidence(v string)`

SetConfidence sets Confidence field to given value.

### HasConfidence

`func (o *EvaluationResultDetail) HasConfidence() bool`

HasConfidence returns a boolean if a field has been set.

### GetArchiveTarget

`func (o *EvaluationResultDetail) GetArchiveTarget() string`

GetArchiveTarget returns the ArchiveTarget field if non-nil, zero value otherwise.

### GetArchiveTargetOk

`func (o *EvaluationResultDetail) GetArchiveTargetOk() (*string, bool)`

GetArchiveTargetOk returns a tuple with the ArchiveTarget field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetArchiveTarget

`func (o *EvaluationResultDetail) SetArchiveTarget(v string)`

SetArchiveTarget sets ArchiveTarget field to given value.

### HasArchiveTarget

`func (o *EvaluationResultDetail) HasArchiveTarget() bool`

HasArchiveTarget returns a boolean if a field has been set.

### SetArchiveTargetNil

`func (o *EvaluationResultDetail) SetArchiveTargetNil(b bool)`

 SetArchiveTargetNil sets the value for ArchiveTarget to be an explicit nil

### UnsetArchiveTarget
`func (o *EvaluationResultDetail) UnsetArchiveTarget()`

UnsetArchiveTarget ensures that no value is present for ArchiveTarget, not even an explicit nil
### GetRetainUntil

`func (o *EvaluationResultDetail) GetRetainUntil() string`

GetRetainUntil returns the RetainUntil field if non-nil, zero value otherwise.

### GetRetainUntilOk

`func (o *EvaluationResultDetail) GetRetainUntilOk() (*string, bool)`

GetRetainUntilOk returns a tuple with the RetainUntil field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRetainUntil

`func (o *EvaluationResultDetail) SetRetainUntil(v string)`

SetRetainUntil sets RetainUntil field to given value.

### HasRetainUntil

`func (o *EvaluationResultDetail) HasRetainUntil() bool`

HasRetainUntil returns a boolean if a field has been set.

### SetRetainUntilNil

`func (o *EvaluationResultDetail) SetRetainUntilNil(b bool)`

 SetRetainUntilNil sets the value for RetainUntil to be an explicit nil

### UnsetRetainUntil
`func (o *EvaluationResultDetail) UnsetRetainUntil()`

UnsetRetainUntil ensures that no value is present for RetainUntil, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


