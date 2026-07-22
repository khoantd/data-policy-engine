# PolicyScope

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**DataTypes** | Pointer to **[]string** |  | [optional] 
**Sources** | Pointer to **[]string** |  | [optional] 
**Exclude** | Pointer to [**NullableScopeExclude**](ScopeExclude.md) |  | [optional] 

## Methods

### NewPolicyScope

`func NewPolicyScope() *PolicyScope`

NewPolicyScope instantiates a new PolicyScope object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPolicyScopeWithDefaults

`func NewPolicyScopeWithDefaults() *PolicyScope`

NewPolicyScopeWithDefaults instantiates a new PolicyScope object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetDataTypes

`func (o *PolicyScope) GetDataTypes() []string`

GetDataTypes returns the DataTypes field if non-nil, zero value otherwise.

### GetDataTypesOk

`func (o *PolicyScope) GetDataTypesOk() (*[]string, bool)`

GetDataTypesOk returns a tuple with the DataTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDataTypes

`func (o *PolicyScope) SetDataTypes(v []string)`

SetDataTypes sets DataTypes field to given value.

### HasDataTypes

`func (o *PolicyScope) HasDataTypes() bool`

HasDataTypes returns a boolean if a field has been set.

### GetSources

`func (o *PolicyScope) GetSources() []string`

GetSources returns the Sources field if non-nil, zero value otherwise.

### GetSourcesOk

`func (o *PolicyScope) GetSourcesOk() (*[]string, bool)`

GetSourcesOk returns a tuple with the Sources field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSources

`func (o *PolicyScope) SetSources(v []string)`

SetSources sets Sources field to given value.

### HasSources

`func (o *PolicyScope) HasSources() bool`

HasSources returns a boolean if a field has been set.

### GetExclude

`func (o *PolicyScope) GetExclude() ScopeExclude`

GetExclude returns the Exclude field if non-nil, zero value otherwise.

### GetExcludeOk

`func (o *PolicyScope) GetExcludeOk() (*ScopeExclude, bool)`

GetExcludeOk returns a tuple with the Exclude field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExclude

`func (o *PolicyScope) SetExclude(v ScopeExclude)`

SetExclude sets Exclude field to given value.

### HasExclude

`func (o *PolicyScope) HasExclude() bool`

HasExclude returns a boolean if a field has been set.

### SetExcludeNil

`func (o *PolicyScope) SetExcludeNil(b bool)`

 SetExcludeNil sets the value for Exclude to be an explicit nil

### UnsetExclude
`func (o *PolicyScope) UnsetExclude()`

UnsetExclude ensures that no value is present for Exclude, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


