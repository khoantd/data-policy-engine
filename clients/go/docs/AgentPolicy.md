# AgentPolicy

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**Name** | **string** |  | 
**Version** | Pointer to **int32** |  | [optional] [default to 1]
**Status** | Pointer to [**PolicyStatus**](PolicyStatus.md) |  | [optional] 
**Jurisdiction** | **string** |  | 
**PolicyKind** | Pointer to [**PolicyKind**](PolicyKind.md) |  | [optional] 
**Owner** | Pointer to **NullableString** |  | [optional] 
**EffectiveFrom** | Pointer to [**NullableEffectiveFrom**](EffectiveFrom.md) |  | [optional] 
**ExpiresAt** | Pointer to [**NullableExpiresAt**](ExpiresAt.md) |  | [optional] 
**Tags** | Pointer to **[]string** |  | [optional] 
**Scope** | Pointer to [**PolicyScope**](PolicyScope.md) |  | [optional] 
**OgrPolicy** | **map[string]interface{}** |  | 
**Rules** | Pointer to **[]interface{}** |  | [optional] 
**ReferenceSources** | Pointer to [**[]ReferenceSource**](ReferenceSource.md) |  | [optional] 

## Methods

### NewAgentPolicy

`func NewAgentPolicy(id string, name string, jurisdiction string, ogrPolicy map[string]interface{}, ) *AgentPolicy`

NewAgentPolicy instantiates a new AgentPolicy object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewAgentPolicyWithDefaults

`func NewAgentPolicyWithDefaults() *AgentPolicy`

NewAgentPolicyWithDefaults instantiates a new AgentPolicy object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *AgentPolicy) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *AgentPolicy) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *AgentPolicy) SetId(v string)`

SetId sets Id field to given value.


### GetName

`func (o *AgentPolicy) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *AgentPolicy) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *AgentPolicy) SetName(v string)`

SetName sets Name field to given value.


### GetVersion

`func (o *AgentPolicy) GetVersion() int32`

GetVersion returns the Version field if non-nil, zero value otherwise.

### GetVersionOk

`func (o *AgentPolicy) GetVersionOk() (*int32, bool)`

GetVersionOk returns a tuple with the Version field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVersion

`func (o *AgentPolicy) SetVersion(v int32)`

SetVersion sets Version field to given value.

### HasVersion

`func (o *AgentPolicy) HasVersion() bool`

HasVersion returns a boolean if a field has been set.

### GetStatus

`func (o *AgentPolicy) GetStatus() PolicyStatus`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *AgentPolicy) GetStatusOk() (*PolicyStatus, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *AgentPolicy) SetStatus(v PolicyStatus)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *AgentPolicy) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetJurisdiction

`func (o *AgentPolicy) GetJurisdiction() string`

GetJurisdiction returns the Jurisdiction field if non-nil, zero value otherwise.

### GetJurisdictionOk

`func (o *AgentPolicy) GetJurisdictionOk() (*string, bool)`

GetJurisdictionOk returns a tuple with the Jurisdiction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetJurisdiction

`func (o *AgentPolicy) SetJurisdiction(v string)`

SetJurisdiction sets Jurisdiction field to given value.


### GetPolicyKind

`func (o *AgentPolicy) GetPolicyKind() PolicyKind`

GetPolicyKind returns the PolicyKind field if non-nil, zero value otherwise.

### GetPolicyKindOk

`func (o *AgentPolicy) GetPolicyKindOk() (*PolicyKind, bool)`

GetPolicyKindOk returns a tuple with the PolicyKind field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyKind

`func (o *AgentPolicy) SetPolicyKind(v PolicyKind)`

SetPolicyKind sets PolicyKind field to given value.

### HasPolicyKind

`func (o *AgentPolicy) HasPolicyKind() bool`

HasPolicyKind returns a boolean if a field has been set.

### GetOwner

`func (o *AgentPolicy) GetOwner() string`

GetOwner returns the Owner field if non-nil, zero value otherwise.

### GetOwnerOk

`func (o *AgentPolicy) GetOwnerOk() (*string, bool)`

GetOwnerOk returns a tuple with the Owner field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOwner

`func (o *AgentPolicy) SetOwner(v string)`

SetOwner sets Owner field to given value.

### HasOwner

`func (o *AgentPolicy) HasOwner() bool`

HasOwner returns a boolean if a field has been set.

### SetOwnerNil

`func (o *AgentPolicy) SetOwnerNil(b bool)`

 SetOwnerNil sets the value for Owner to be an explicit nil

### UnsetOwner
`func (o *AgentPolicy) UnsetOwner()`

UnsetOwner ensures that no value is present for Owner, not even an explicit nil
### GetEffectiveFrom

`func (o *AgentPolicy) GetEffectiveFrom() EffectiveFrom`

GetEffectiveFrom returns the EffectiveFrom field if non-nil, zero value otherwise.

### GetEffectiveFromOk

`func (o *AgentPolicy) GetEffectiveFromOk() (*EffectiveFrom, bool)`

GetEffectiveFromOk returns a tuple with the EffectiveFrom field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEffectiveFrom

`func (o *AgentPolicy) SetEffectiveFrom(v EffectiveFrom)`

SetEffectiveFrom sets EffectiveFrom field to given value.

### HasEffectiveFrom

`func (o *AgentPolicy) HasEffectiveFrom() bool`

HasEffectiveFrom returns a boolean if a field has been set.

### SetEffectiveFromNil

`func (o *AgentPolicy) SetEffectiveFromNil(b bool)`

 SetEffectiveFromNil sets the value for EffectiveFrom to be an explicit nil

### UnsetEffectiveFrom
`func (o *AgentPolicy) UnsetEffectiveFrom()`

UnsetEffectiveFrom ensures that no value is present for EffectiveFrom, not even an explicit nil
### GetExpiresAt

`func (o *AgentPolicy) GetExpiresAt() ExpiresAt`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *AgentPolicy) GetExpiresAtOk() (*ExpiresAt, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *AgentPolicy) SetExpiresAt(v ExpiresAt)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *AgentPolicy) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### SetExpiresAtNil

`func (o *AgentPolicy) SetExpiresAtNil(b bool)`

 SetExpiresAtNil sets the value for ExpiresAt to be an explicit nil

### UnsetExpiresAt
`func (o *AgentPolicy) UnsetExpiresAt()`

UnsetExpiresAt ensures that no value is present for ExpiresAt, not even an explicit nil
### GetTags

`func (o *AgentPolicy) GetTags() []string`

GetTags returns the Tags field if non-nil, zero value otherwise.

### GetTagsOk

`func (o *AgentPolicy) GetTagsOk() (*[]string, bool)`

GetTagsOk returns a tuple with the Tags field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTags

`func (o *AgentPolicy) SetTags(v []string)`

SetTags sets Tags field to given value.

### HasTags

`func (o *AgentPolicy) HasTags() bool`

HasTags returns a boolean if a field has been set.

### GetScope

`func (o *AgentPolicy) GetScope() PolicyScope`

GetScope returns the Scope field if non-nil, zero value otherwise.

### GetScopeOk

`func (o *AgentPolicy) GetScopeOk() (*PolicyScope, bool)`

GetScopeOk returns a tuple with the Scope field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScope

`func (o *AgentPolicy) SetScope(v PolicyScope)`

SetScope sets Scope field to given value.

### HasScope

`func (o *AgentPolicy) HasScope() bool`

HasScope returns a boolean if a field has been set.

### GetOgrPolicy

`func (o *AgentPolicy) GetOgrPolicy() map[string]interface{}`

GetOgrPolicy returns the OgrPolicy field if non-nil, zero value otherwise.

### GetOgrPolicyOk

`func (o *AgentPolicy) GetOgrPolicyOk() (*map[string]interface{}, bool)`

GetOgrPolicyOk returns a tuple with the OgrPolicy field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOgrPolicy

`func (o *AgentPolicy) SetOgrPolicy(v map[string]interface{})`

SetOgrPolicy sets OgrPolicy field to given value.


### GetRules

`func (o *AgentPolicy) GetRules() []interface{}`

GetRules returns the Rules field if non-nil, zero value otherwise.

### GetRulesOk

`func (o *AgentPolicy) GetRulesOk() (*[]interface{}, bool)`

GetRulesOk returns a tuple with the Rules field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRules

`func (o *AgentPolicy) SetRules(v []interface{})`

SetRules sets Rules field to given value.

### HasRules

`func (o *AgentPolicy) HasRules() bool`

HasRules returns a boolean if a field has been set.

### GetReferenceSources

`func (o *AgentPolicy) GetReferenceSources() []ReferenceSource`

GetReferenceSources returns the ReferenceSources field if non-nil, zero value otherwise.

### GetReferenceSourcesOk

`func (o *AgentPolicy) GetReferenceSourcesOk() (*[]ReferenceSource, bool)`

GetReferenceSourcesOk returns a tuple with the ReferenceSources field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReferenceSources

`func (o *AgentPolicy) SetReferenceSources(v []ReferenceSource)`

SetReferenceSources sets ReferenceSources field to given value.

### HasReferenceSources

`func (o *AgentPolicy) HasReferenceSources() bool`

HasReferenceSources returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


