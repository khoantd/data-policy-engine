# PolicyListItem

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**Name** | **string** |  | 
**Version** | **int32** |  | 
**Status** | [**PolicyStatus**](PolicyStatus.md) |  | 
**Jurisdiction** | **string** |  | 
**PolicyKind** | [**PolicyKind**](PolicyKind.md) |  | 
**DataClassification** | Pointer to **NullableString** |  | [optional] 
**EntityCount** | Pointer to **NullableInt32** |  | [optional] 
**ScopeDataTypes** | Pointer to **[]string** |  | [optional] 
**ScopeSources** | Pointer to **[]string** |  | [optional] 
**ExcludedDataTypes** | Pointer to **[]string** |  | [optional] 
**ExcludedSources** | Pointer to **[]string** |  | [optional] 
**RuleCount** | **int32** |  | 

## Methods

### NewPolicyListItem

`func NewPolicyListItem(id string, name string, version int32, status PolicyStatus, jurisdiction string, policyKind PolicyKind, ruleCount int32, ) *PolicyListItem`

NewPolicyListItem instantiates a new PolicyListItem object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPolicyListItemWithDefaults

`func NewPolicyListItemWithDefaults() *PolicyListItem`

NewPolicyListItemWithDefaults instantiates a new PolicyListItem object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *PolicyListItem) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *PolicyListItem) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *PolicyListItem) SetId(v string)`

SetId sets Id field to given value.


### GetName

`func (o *PolicyListItem) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *PolicyListItem) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *PolicyListItem) SetName(v string)`

SetName sets Name field to given value.


### GetVersion

`func (o *PolicyListItem) GetVersion() int32`

GetVersion returns the Version field if non-nil, zero value otherwise.

### GetVersionOk

`func (o *PolicyListItem) GetVersionOk() (*int32, bool)`

GetVersionOk returns a tuple with the Version field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVersion

`func (o *PolicyListItem) SetVersion(v int32)`

SetVersion sets Version field to given value.


### GetStatus

`func (o *PolicyListItem) GetStatus() PolicyStatus`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *PolicyListItem) GetStatusOk() (*PolicyStatus, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *PolicyListItem) SetStatus(v PolicyStatus)`

SetStatus sets Status field to given value.


### GetJurisdiction

`func (o *PolicyListItem) GetJurisdiction() string`

GetJurisdiction returns the Jurisdiction field if non-nil, zero value otherwise.

### GetJurisdictionOk

`func (o *PolicyListItem) GetJurisdictionOk() (*string, bool)`

GetJurisdictionOk returns a tuple with the Jurisdiction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetJurisdiction

`func (o *PolicyListItem) SetJurisdiction(v string)`

SetJurisdiction sets Jurisdiction field to given value.


### GetPolicyKind

`func (o *PolicyListItem) GetPolicyKind() PolicyKind`

GetPolicyKind returns the PolicyKind field if non-nil, zero value otherwise.

### GetPolicyKindOk

`func (o *PolicyListItem) GetPolicyKindOk() (*PolicyKind, bool)`

GetPolicyKindOk returns a tuple with the PolicyKind field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyKind

`func (o *PolicyListItem) SetPolicyKind(v PolicyKind)`

SetPolicyKind sets PolicyKind field to given value.


### GetDataClassification

`func (o *PolicyListItem) GetDataClassification() string`

GetDataClassification returns the DataClassification field if non-nil, zero value otherwise.

### GetDataClassificationOk

`func (o *PolicyListItem) GetDataClassificationOk() (*string, bool)`

GetDataClassificationOk returns a tuple with the DataClassification field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDataClassification

`func (o *PolicyListItem) SetDataClassification(v string)`

SetDataClassification sets DataClassification field to given value.

### HasDataClassification

`func (o *PolicyListItem) HasDataClassification() bool`

HasDataClassification returns a boolean if a field has been set.

### SetDataClassificationNil

`func (o *PolicyListItem) SetDataClassificationNil(b bool)`

 SetDataClassificationNil sets the value for DataClassification to be an explicit nil

### UnsetDataClassification
`func (o *PolicyListItem) UnsetDataClassification()`

UnsetDataClassification ensures that no value is present for DataClassification, not even an explicit nil
### GetEntityCount

`func (o *PolicyListItem) GetEntityCount() int32`

GetEntityCount returns the EntityCount field if non-nil, zero value otherwise.

### GetEntityCountOk

`func (o *PolicyListItem) GetEntityCountOk() (*int32, bool)`

GetEntityCountOk returns a tuple with the EntityCount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEntityCount

`func (o *PolicyListItem) SetEntityCount(v int32)`

SetEntityCount sets EntityCount field to given value.

### HasEntityCount

`func (o *PolicyListItem) HasEntityCount() bool`

HasEntityCount returns a boolean if a field has been set.

### SetEntityCountNil

`func (o *PolicyListItem) SetEntityCountNil(b bool)`

 SetEntityCountNil sets the value for EntityCount to be an explicit nil

### UnsetEntityCount
`func (o *PolicyListItem) UnsetEntityCount()`

UnsetEntityCount ensures that no value is present for EntityCount, not even an explicit nil
### GetScopeDataTypes

`func (o *PolicyListItem) GetScopeDataTypes() []string`

GetScopeDataTypes returns the ScopeDataTypes field if non-nil, zero value otherwise.

### GetScopeDataTypesOk

`func (o *PolicyListItem) GetScopeDataTypesOk() (*[]string, bool)`

GetScopeDataTypesOk returns a tuple with the ScopeDataTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScopeDataTypes

`func (o *PolicyListItem) SetScopeDataTypes(v []string)`

SetScopeDataTypes sets ScopeDataTypes field to given value.

### HasScopeDataTypes

`func (o *PolicyListItem) HasScopeDataTypes() bool`

HasScopeDataTypes returns a boolean if a field has been set.

### GetScopeSources

`func (o *PolicyListItem) GetScopeSources() []string`

GetScopeSources returns the ScopeSources field if non-nil, zero value otherwise.

### GetScopeSourcesOk

`func (o *PolicyListItem) GetScopeSourcesOk() (*[]string, bool)`

GetScopeSourcesOk returns a tuple with the ScopeSources field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScopeSources

`func (o *PolicyListItem) SetScopeSources(v []string)`

SetScopeSources sets ScopeSources field to given value.

### HasScopeSources

`func (o *PolicyListItem) HasScopeSources() bool`

HasScopeSources returns a boolean if a field has been set.

### GetExcludedDataTypes

`func (o *PolicyListItem) GetExcludedDataTypes() []string`

GetExcludedDataTypes returns the ExcludedDataTypes field if non-nil, zero value otherwise.

### GetExcludedDataTypesOk

`func (o *PolicyListItem) GetExcludedDataTypesOk() (*[]string, bool)`

GetExcludedDataTypesOk returns a tuple with the ExcludedDataTypes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExcludedDataTypes

`func (o *PolicyListItem) SetExcludedDataTypes(v []string)`

SetExcludedDataTypes sets ExcludedDataTypes field to given value.

### HasExcludedDataTypes

`func (o *PolicyListItem) HasExcludedDataTypes() bool`

HasExcludedDataTypes returns a boolean if a field has been set.

### GetExcludedSources

`func (o *PolicyListItem) GetExcludedSources() []string`

GetExcludedSources returns the ExcludedSources field if non-nil, zero value otherwise.

### GetExcludedSourcesOk

`func (o *PolicyListItem) GetExcludedSourcesOk() (*[]string, bool)`

GetExcludedSourcesOk returns a tuple with the ExcludedSources field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExcludedSources

`func (o *PolicyListItem) SetExcludedSources(v []string)`

SetExcludedSources sets ExcludedSources field to given value.

### HasExcludedSources

`func (o *PolicyListItem) HasExcludedSources() bool`

HasExcludedSources returns a boolean if a field has been set.

### GetRuleCount

`func (o *PolicyListItem) GetRuleCount() int32`

GetRuleCount returns the RuleCount field if non-nil, zero value otherwise.

### GetRuleCountOk

`func (o *PolicyListItem) GetRuleCountOk() (*int32, bool)`

GetRuleCountOk returns a tuple with the RuleCount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRuleCount

`func (o *PolicyListItem) SetRuleCount(v int32)`

SetRuleCount sets RuleCount field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


