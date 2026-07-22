# PolicyRule

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**Description** | Pointer to **NullableString** |  | [optional] 
**Priority** | **int32** |  | 
**Condition** | [**ConditionGroup**](ConditionGroup.md) |  | 
**Action** | [**Action**](Action.md) |  | 
**GracePeriod** | Pointer to **NullableString** |  | [optional] 
**NotifyBefore** | Pointer to **NullableString** |  | [optional] 
**RequiresApproval** | Pointer to **bool** |  | [optional] [default to false]
**ArchiveTarget** | Pointer to **NullableString** |  | [optional] 
**RetainUntil** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewPolicyRule

`func NewPolicyRule(id string, priority int32, condition ConditionGroup, action Action, ) *PolicyRule`

NewPolicyRule instantiates a new PolicyRule object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPolicyRuleWithDefaults

`func NewPolicyRuleWithDefaults() *PolicyRule`

NewPolicyRuleWithDefaults instantiates a new PolicyRule object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *PolicyRule) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *PolicyRule) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *PolicyRule) SetId(v string)`

SetId sets Id field to given value.


### GetDescription

`func (o *PolicyRule) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *PolicyRule) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *PolicyRule) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *PolicyRule) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### SetDescriptionNil

`func (o *PolicyRule) SetDescriptionNil(b bool)`

 SetDescriptionNil sets the value for Description to be an explicit nil

### UnsetDescription
`func (o *PolicyRule) UnsetDescription()`

UnsetDescription ensures that no value is present for Description, not even an explicit nil
### GetPriority

`func (o *PolicyRule) GetPriority() int32`

GetPriority returns the Priority field if non-nil, zero value otherwise.

### GetPriorityOk

`func (o *PolicyRule) GetPriorityOk() (*int32, bool)`

GetPriorityOk returns a tuple with the Priority field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriority

`func (o *PolicyRule) SetPriority(v int32)`

SetPriority sets Priority field to given value.


### GetCondition

`func (o *PolicyRule) GetCondition() ConditionGroup`

GetCondition returns the Condition field if non-nil, zero value otherwise.

### GetConditionOk

`func (o *PolicyRule) GetConditionOk() (*ConditionGroup, bool)`

GetConditionOk returns a tuple with the Condition field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCondition

`func (o *PolicyRule) SetCondition(v ConditionGroup)`

SetCondition sets Condition field to given value.


### GetAction

`func (o *PolicyRule) GetAction() Action`

GetAction returns the Action field if non-nil, zero value otherwise.

### GetActionOk

`func (o *PolicyRule) GetActionOk() (*Action, bool)`

GetActionOk returns a tuple with the Action field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAction

`func (o *PolicyRule) SetAction(v Action)`

SetAction sets Action field to given value.


### GetGracePeriod

`func (o *PolicyRule) GetGracePeriod() string`

GetGracePeriod returns the GracePeriod field if non-nil, zero value otherwise.

### GetGracePeriodOk

`func (o *PolicyRule) GetGracePeriodOk() (*string, bool)`

GetGracePeriodOk returns a tuple with the GracePeriod field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGracePeriod

`func (o *PolicyRule) SetGracePeriod(v string)`

SetGracePeriod sets GracePeriod field to given value.

### HasGracePeriod

`func (o *PolicyRule) HasGracePeriod() bool`

HasGracePeriod returns a boolean if a field has been set.

### SetGracePeriodNil

`func (o *PolicyRule) SetGracePeriodNil(b bool)`

 SetGracePeriodNil sets the value for GracePeriod to be an explicit nil

### UnsetGracePeriod
`func (o *PolicyRule) UnsetGracePeriod()`

UnsetGracePeriod ensures that no value is present for GracePeriod, not even an explicit nil
### GetNotifyBefore

`func (o *PolicyRule) GetNotifyBefore() string`

GetNotifyBefore returns the NotifyBefore field if non-nil, zero value otherwise.

### GetNotifyBeforeOk

`func (o *PolicyRule) GetNotifyBeforeOk() (*string, bool)`

GetNotifyBeforeOk returns a tuple with the NotifyBefore field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNotifyBefore

`func (o *PolicyRule) SetNotifyBefore(v string)`

SetNotifyBefore sets NotifyBefore field to given value.

### HasNotifyBefore

`func (o *PolicyRule) HasNotifyBefore() bool`

HasNotifyBefore returns a boolean if a field has been set.

### SetNotifyBeforeNil

`func (o *PolicyRule) SetNotifyBeforeNil(b bool)`

 SetNotifyBeforeNil sets the value for NotifyBefore to be an explicit nil

### UnsetNotifyBefore
`func (o *PolicyRule) UnsetNotifyBefore()`

UnsetNotifyBefore ensures that no value is present for NotifyBefore, not even an explicit nil
### GetRequiresApproval

`func (o *PolicyRule) GetRequiresApproval() bool`

GetRequiresApproval returns the RequiresApproval field if non-nil, zero value otherwise.

### GetRequiresApprovalOk

`func (o *PolicyRule) GetRequiresApprovalOk() (*bool, bool)`

GetRequiresApprovalOk returns a tuple with the RequiresApproval field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRequiresApproval

`func (o *PolicyRule) SetRequiresApproval(v bool)`

SetRequiresApproval sets RequiresApproval field to given value.

### HasRequiresApproval

`func (o *PolicyRule) HasRequiresApproval() bool`

HasRequiresApproval returns a boolean if a field has been set.

### GetArchiveTarget

`func (o *PolicyRule) GetArchiveTarget() string`

GetArchiveTarget returns the ArchiveTarget field if non-nil, zero value otherwise.

### GetArchiveTargetOk

`func (o *PolicyRule) GetArchiveTargetOk() (*string, bool)`

GetArchiveTargetOk returns a tuple with the ArchiveTarget field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetArchiveTarget

`func (o *PolicyRule) SetArchiveTarget(v string)`

SetArchiveTarget sets ArchiveTarget field to given value.

### HasArchiveTarget

`func (o *PolicyRule) HasArchiveTarget() bool`

HasArchiveTarget returns a boolean if a field has been set.

### SetArchiveTargetNil

`func (o *PolicyRule) SetArchiveTargetNil(b bool)`

 SetArchiveTargetNil sets the value for ArchiveTarget to be an explicit nil

### UnsetArchiveTarget
`func (o *PolicyRule) UnsetArchiveTarget()`

UnsetArchiveTarget ensures that no value is present for ArchiveTarget, not even an explicit nil
### GetRetainUntil

`func (o *PolicyRule) GetRetainUntil() string`

GetRetainUntil returns the RetainUntil field if non-nil, zero value otherwise.

### GetRetainUntilOk

`func (o *PolicyRule) GetRetainUntilOk() (*string, bool)`

GetRetainUntilOk returns a tuple with the RetainUntil field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRetainUntil

`func (o *PolicyRule) SetRetainUntil(v string)`

SetRetainUntil sets RetainUntil field to given value.

### HasRetainUntil

`func (o *PolicyRule) HasRetainUntil() bool`

HasRetainUntil returns a boolean if a field has been set.

### SetRetainUntilNil

`func (o *PolicyRule) SetRetainUntilNil(b bool)`

 SetRetainUntilNil sets the value for RetainUntil to be an explicit nil

### UnsetRetainUntil
`func (o *PolicyRule) UnsetRetainUntil()`

UnsetRetainUntil ensures that no value is present for RetainUntil, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


