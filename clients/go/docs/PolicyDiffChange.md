# PolicyDiffChange

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Path** | **string** |  | 
**Op** | **string** |  | 
**Old** | Pointer to **interface{}** |  | [optional] 
**New** | Pointer to **interface{}** |  | [optional] 

## Methods

### NewPolicyDiffChange

`func NewPolicyDiffChange(path string, op string, ) *PolicyDiffChange`

NewPolicyDiffChange instantiates a new PolicyDiffChange object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPolicyDiffChangeWithDefaults

`func NewPolicyDiffChangeWithDefaults() *PolicyDiffChange`

NewPolicyDiffChangeWithDefaults instantiates a new PolicyDiffChange object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetPath

`func (o *PolicyDiffChange) GetPath() string`

GetPath returns the Path field if non-nil, zero value otherwise.

### GetPathOk

`func (o *PolicyDiffChange) GetPathOk() (*string, bool)`

GetPathOk returns a tuple with the Path field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPath

`func (o *PolicyDiffChange) SetPath(v string)`

SetPath sets Path field to given value.


### GetOp

`func (o *PolicyDiffChange) GetOp() string`

GetOp returns the Op field if non-nil, zero value otherwise.

### GetOpOk

`func (o *PolicyDiffChange) GetOpOk() (*string, bool)`

GetOpOk returns a tuple with the Op field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOp

`func (o *PolicyDiffChange) SetOp(v string)`

SetOp sets Op field to given value.


### GetOld

`func (o *PolicyDiffChange) GetOld() interface{}`

GetOld returns the Old field if non-nil, zero value otherwise.

### GetOldOk

`func (o *PolicyDiffChange) GetOldOk() (*interface{}, bool)`

GetOldOk returns a tuple with the Old field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOld

`func (o *PolicyDiffChange) SetOld(v interface{})`

SetOld sets Old field to given value.

### HasOld

`func (o *PolicyDiffChange) HasOld() bool`

HasOld returns a boolean if a field has been set.

### SetOldNil

`func (o *PolicyDiffChange) SetOldNil(b bool)`

 SetOldNil sets the value for Old to be an explicit nil

### UnsetOld
`func (o *PolicyDiffChange) UnsetOld()`

UnsetOld ensures that no value is present for Old, not even an explicit nil
### GetNew

`func (o *PolicyDiffChange) GetNew() interface{}`

GetNew returns the New field if non-nil, zero value otherwise.

### GetNewOk

`func (o *PolicyDiffChange) GetNewOk() (*interface{}, bool)`

GetNewOk returns a tuple with the New field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNew

`func (o *PolicyDiffChange) SetNew(v interface{})`

SetNew sets New field to given value.

### HasNew

`func (o *PolicyDiffChange) HasNew() bool`

HasNew returns a boolean if a field has been set.

### SetNewNil

`func (o *PolicyDiffChange) SetNewNil(b bool)`

 SetNewNil sets the value for New to be an explicit nil

### UnsetNew
`func (o *PolicyDiffChange) UnsetNew()`

UnsetNew ensures that no value is present for New, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


