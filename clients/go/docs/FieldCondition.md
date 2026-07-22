# FieldCondition

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Field** | **string** |  | 
**Operator** | [**Operator**](Operator.md) |  | 
**Value** | Pointer to **interface{}** |  | [optional] 

## Methods

### NewFieldCondition

`func NewFieldCondition(field string, operator Operator, ) *FieldCondition`

NewFieldCondition instantiates a new FieldCondition object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewFieldConditionWithDefaults

`func NewFieldConditionWithDefaults() *FieldCondition`

NewFieldConditionWithDefaults instantiates a new FieldCondition object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetField

`func (o *FieldCondition) GetField() string`

GetField returns the Field field if non-nil, zero value otherwise.

### GetFieldOk

`func (o *FieldCondition) GetFieldOk() (*string, bool)`

GetFieldOk returns a tuple with the Field field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetField

`func (o *FieldCondition) SetField(v string)`

SetField sets Field field to given value.


### GetOperator

`func (o *FieldCondition) GetOperator() Operator`

GetOperator returns the Operator field if non-nil, zero value otherwise.

### GetOperatorOk

`func (o *FieldCondition) GetOperatorOk() (*Operator, bool)`

GetOperatorOk returns a tuple with the Operator field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOperator

`func (o *FieldCondition) SetOperator(v Operator)`

SetOperator sets Operator field to given value.


### GetValue

`func (o *FieldCondition) GetValue() interface{}`

GetValue returns the Value field if non-nil, zero value otherwise.

### GetValueOk

`func (o *FieldCondition) GetValueOk() (*interface{}, bool)`

GetValueOk returns a tuple with the Value field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetValue

`func (o *FieldCondition) SetValue(v interface{})`

SetValue sets Value field to given value.

### HasValue

`func (o *FieldCondition) HasValue() bool`

HasValue returns a boolean if a field has been set.

### SetValueNil

`func (o *FieldCondition) SetValueNil(b bool)`

 SetValueNil sets the value for Value to be an explicit nil

### UnsetValue
`func (o *FieldCondition) UnsetValue()`

UnsetValue ensures that no value is present for Value, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


