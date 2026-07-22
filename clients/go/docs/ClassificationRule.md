# ClassificationRule

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**Description** | Pointer to **NullableString** |  | [optional] 
**Priority** | **int32** |  | 
**Condition** | [**ConditionGroup**](ConditionGroup.md) |  | 
**Action** | [**ClassificationAction**](ClassificationAction.md) |  | 
**Handling** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewClassificationRule

`func NewClassificationRule(id string, priority int32, condition ConditionGroup, action ClassificationAction, ) *ClassificationRule`

NewClassificationRule instantiates a new ClassificationRule object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewClassificationRuleWithDefaults

`func NewClassificationRuleWithDefaults() *ClassificationRule`

NewClassificationRuleWithDefaults instantiates a new ClassificationRule object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *ClassificationRule) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *ClassificationRule) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *ClassificationRule) SetId(v string)`

SetId sets Id field to given value.


### GetDescription

`func (o *ClassificationRule) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *ClassificationRule) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *ClassificationRule) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *ClassificationRule) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### SetDescriptionNil

`func (o *ClassificationRule) SetDescriptionNil(b bool)`

 SetDescriptionNil sets the value for Description to be an explicit nil

### UnsetDescription
`func (o *ClassificationRule) UnsetDescription()`

UnsetDescription ensures that no value is present for Description, not even an explicit nil
### GetPriority

`func (o *ClassificationRule) GetPriority() int32`

GetPriority returns the Priority field if non-nil, zero value otherwise.

### GetPriorityOk

`func (o *ClassificationRule) GetPriorityOk() (*int32, bool)`

GetPriorityOk returns a tuple with the Priority field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriority

`func (o *ClassificationRule) SetPriority(v int32)`

SetPriority sets Priority field to given value.


### GetCondition

`func (o *ClassificationRule) GetCondition() ConditionGroup`

GetCondition returns the Condition field if non-nil, zero value otherwise.

### GetConditionOk

`func (o *ClassificationRule) GetConditionOk() (*ConditionGroup, bool)`

GetConditionOk returns a tuple with the Condition field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCondition

`func (o *ClassificationRule) SetCondition(v ConditionGroup)`

SetCondition sets Condition field to given value.


### GetAction

`func (o *ClassificationRule) GetAction() ClassificationAction`

GetAction returns the Action field if non-nil, zero value otherwise.

### GetActionOk

`func (o *ClassificationRule) GetActionOk() (*ClassificationAction, bool)`

GetActionOk returns a tuple with the Action field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAction

`func (o *ClassificationRule) SetAction(v ClassificationAction)`

SetAction sets Action field to given value.


### GetHandling

`func (o *ClassificationRule) GetHandling() string`

GetHandling returns the Handling field if non-nil, zero value otherwise.

### GetHandlingOk

`func (o *ClassificationRule) GetHandlingOk() (*string, bool)`

GetHandlingOk returns a tuple with the Handling field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetHandling

`func (o *ClassificationRule) SetHandling(v string)`

SetHandling sets Handling field to given value.

### HasHandling

`func (o *ClassificationRule) HasHandling() bool`

HasHandling returns a boolean if a field has been set.

### SetHandlingNil

`func (o *ClassificationRule) SetHandlingNil(b bool)`

 SetHandlingNil sets the value for Handling to be an explicit nil

### UnsetHandling
`func (o *ClassificationRule) UnsetHandling()`

UnsetHandling ensures that no value is present for Handling, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


