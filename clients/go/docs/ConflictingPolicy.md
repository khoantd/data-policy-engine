# ConflictingPolicy

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**PolicyId** | **string** |  | 
**RuleId** | **string** |  | 
**Action** | [**Action**](Action.md) |  | 
**Priority** | **int32** |  | 

## Methods

### NewConflictingPolicy

`func NewConflictingPolicy(policyId string, ruleId string, action Action, priority int32, ) *ConflictingPolicy`

NewConflictingPolicy instantiates a new ConflictingPolicy object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewConflictingPolicyWithDefaults

`func NewConflictingPolicyWithDefaults() *ConflictingPolicy`

NewConflictingPolicyWithDefaults instantiates a new ConflictingPolicy object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetPolicyId

`func (o *ConflictingPolicy) GetPolicyId() string`

GetPolicyId returns the PolicyId field if non-nil, zero value otherwise.

### GetPolicyIdOk

`func (o *ConflictingPolicy) GetPolicyIdOk() (*string, bool)`

GetPolicyIdOk returns a tuple with the PolicyId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyId

`func (o *ConflictingPolicy) SetPolicyId(v string)`

SetPolicyId sets PolicyId field to given value.


### GetRuleId

`func (o *ConflictingPolicy) GetRuleId() string`

GetRuleId returns the RuleId field if non-nil, zero value otherwise.

### GetRuleIdOk

`func (o *ConflictingPolicy) GetRuleIdOk() (*string, bool)`

GetRuleIdOk returns a tuple with the RuleId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRuleId

`func (o *ConflictingPolicy) SetRuleId(v string)`

SetRuleId sets RuleId field to given value.


### GetAction

`func (o *ConflictingPolicy) GetAction() Action`

GetAction returns the Action field if non-nil, zero value otherwise.

### GetActionOk

`func (o *ConflictingPolicy) GetActionOk() (*Action, bool)`

GetActionOk returns a tuple with the Action field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAction

`func (o *ConflictingPolicy) SetAction(v Action)`

SetAction sets Action field to given value.


### GetPriority

`func (o *ConflictingPolicy) GetPriority() int32`

GetPriority returns the Priority field if non-nil, zero value otherwise.

### GetPriorityOk

`func (o *ConflictingPolicy) GetPriorityOk() (*int32, bool)`

GetPriorityOk returns a tuple with the Priority field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPriority

`func (o *ConflictingPolicy) SetPriority(v int32)`

SetPriority sets Priority field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


