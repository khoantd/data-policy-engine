# ConditionGroup

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**All** | Pointer to [**[]FieldCondition**](FieldCondition.md) |  | [optional] 
**Any** | Pointer to [**[]FieldCondition**](FieldCondition.md) |  | [optional] 

## Methods

### NewConditionGroup

`func NewConditionGroup() *ConditionGroup`

NewConditionGroup instantiates a new ConditionGroup object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewConditionGroupWithDefaults

`func NewConditionGroupWithDefaults() *ConditionGroup`

NewConditionGroupWithDefaults instantiates a new ConditionGroup object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetAll

`func (o *ConditionGroup) GetAll() []FieldCondition`

GetAll returns the All field if non-nil, zero value otherwise.

### GetAllOk

`func (o *ConditionGroup) GetAllOk() (*[]FieldCondition, bool)`

GetAllOk returns a tuple with the All field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAll

`func (o *ConditionGroup) SetAll(v []FieldCondition)`

SetAll sets All field to given value.

### HasAll

`func (o *ConditionGroup) HasAll() bool`

HasAll returns a boolean if a field has been set.

### SetAllNil

`func (o *ConditionGroup) SetAllNil(b bool)`

 SetAllNil sets the value for All to be an explicit nil

### UnsetAll
`func (o *ConditionGroup) UnsetAll()`

UnsetAll ensures that no value is present for All, not even an explicit nil
### GetAny

`func (o *ConditionGroup) GetAny() []FieldCondition`

GetAny returns the Any field if non-nil, zero value otherwise.

### GetAnyOk

`func (o *ConditionGroup) GetAnyOk() (*[]FieldCondition, bool)`

GetAnyOk returns a tuple with the Any field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAny

`func (o *ConditionGroup) SetAny(v []FieldCondition)`

SetAny sets Any field to given value.

### HasAny

`func (o *ConditionGroup) HasAny() bool`

HasAny returns a boolean if a field has been set.

### SetAnyNil

`func (o *ConditionGroup) SetAnyNil(b bool)`

 SetAnyNil sets the value for Any to be an explicit nil

### UnsetAny
`func (o *ConditionGroup) UnsetAny()`

UnsetAny ensures that no value is present for Any, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


