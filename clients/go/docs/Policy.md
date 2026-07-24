# Policy

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**Name** | **string** |  | 
**Version** | Pointer to **int32** |  | [optional] [default to 1]
**Status** | Pointer to [**PolicyStatus**](PolicyStatus.md) |  | [optional] 
**Jurisdiction** | **string** |  | 
**PolicyKind** | Pointer to [**PolicyKind**](PolicyKind.md) |  | [optional] 
**DataClassification** | [**DataClassification**](DataClassification.md) |  | 
**Owner** | Pointer to **NullableString** |  | [optional] 
**EffectiveFrom** | Pointer to [**NullableEffectiveFrom**](EffectiveFrom.md) |  | [optional] 
**ExpiresAt** | Pointer to [**NullableExpiresAt**](ExpiresAt.md) |  | [optional] 
**Tags** | Pointer to **[]string** |  | [optional] 
**Scope** | Pointer to [**PolicyScope**](PolicyScope.md) |  | [optional] 
**Rules** | [**[]PolicyRule**](PolicyRule.md) |  | 
**Dsar** | Pointer to [**NullableDsarConfig**](DsarConfig.md) |  | [optional] 
**Audit** | Pointer to [**NullableAuditConfig**](AuditConfig.md) |  | [optional] 
**ReferenceSources** | Pointer to [**[]ReferenceSource**](ReferenceSource.md) |  | [optional] 

## Methods

### NewPolicy

`func NewPolicy(id string, name string, jurisdiction string, dataClassification DataClassification, rules []PolicyRule, ) *Policy`

NewPolicy instantiates a new Policy object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPolicyWithDefaults

`func NewPolicyWithDefaults() *Policy`

NewPolicyWithDefaults instantiates a new Policy object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *Policy) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *Policy) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *Policy) SetId(v string)`

SetId sets Id field to given value.


### GetName

`func (o *Policy) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *Policy) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *Policy) SetName(v string)`

SetName sets Name field to given value.


### GetVersion

`func (o *Policy) GetVersion() int32`

GetVersion returns the Version field if non-nil, zero value otherwise.

### GetVersionOk

`func (o *Policy) GetVersionOk() (*int32, bool)`

GetVersionOk returns a tuple with the Version field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVersion

`func (o *Policy) SetVersion(v int32)`

SetVersion sets Version field to given value.

### HasVersion

`func (o *Policy) HasVersion() bool`

HasVersion returns a boolean if a field has been set.

### GetStatus

`func (o *Policy) GetStatus() PolicyStatus`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *Policy) GetStatusOk() (*PolicyStatus, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *Policy) SetStatus(v PolicyStatus)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *Policy) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetJurisdiction

`func (o *Policy) GetJurisdiction() string`

GetJurisdiction returns the Jurisdiction field if non-nil, zero value otherwise.

### GetJurisdictionOk

`func (o *Policy) GetJurisdictionOk() (*string, bool)`

GetJurisdictionOk returns a tuple with the Jurisdiction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetJurisdiction

`func (o *Policy) SetJurisdiction(v string)`

SetJurisdiction sets Jurisdiction field to given value.


### GetPolicyKind

`func (o *Policy) GetPolicyKind() PolicyKind`

GetPolicyKind returns the PolicyKind field if non-nil, zero value otherwise.

### GetPolicyKindOk

`func (o *Policy) GetPolicyKindOk() (*PolicyKind, bool)`

GetPolicyKindOk returns a tuple with the PolicyKind field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyKind

`func (o *Policy) SetPolicyKind(v PolicyKind)`

SetPolicyKind sets PolicyKind field to given value.

### HasPolicyKind

`func (o *Policy) HasPolicyKind() bool`

HasPolicyKind returns a boolean if a field has been set.

### GetDataClassification

`func (o *Policy) GetDataClassification() DataClassification`

GetDataClassification returns the DataClassification field if non-nil, zero value otherwise.

### GetDataClassificationOk

`func (o *Policy) GetDataClassificationOk() (*DataClassification, bool)`

GetDataClassificationOk returns a tuple with the DataClassification field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDataClassification

`func (o *Policy) SetDataClassification(v DataClassification)`

SetDataClassification sets DataClassification field to given value.


### GetOwner

`func (o *Policy) GetOwner() string`

GetOwner returns the Owner field if non-nil, zero value otherwise.

### GetOwnerOk

`func (o *Policy) GetOwnerOk() (*string, bool)`

GetOwnerOk returns a tuple with the Owner field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOwner

`func (o *Policy) SetOwner(v string)`

SetOwner sets Owner field to given value.

### HasOwner

`func (o *Policy) HasOwner() bool`

HasOwner returns a boolean if a field has been set.

### SetOwnerNil

`func (o *Policy) SetOwnerNil(b bool)`

 SetOwnerNil sets the value for Owner to be an explicit nil

### UnsetOwner
`func (o *Policy) UnsetOwner()`

UnsetOwner ensures that no value is present for Owner, not even an explicit nil
### GetEffectiveFrom

`func (o *Policy) GetEffectiveFrom() EffectiveFrom`

GetEffectiveFrom returns the EffectiveFrom field if non-nil, zero value otherwise.

### GetEffectiveFromOk

`func (o *Policy) GetEffectiveFromOk() (*EffectiveFrom, bool)`

GetEffectiveFromOk returns a tuple with the EffectiveFrom field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEffectiveFrom

`func (o *Policy) SetEffectiveFrom(v EffectiveFrom)`

SetEffectiveFrom sets EffectiveFrom field to given value.

### HasEffectiveFrom

`func (o *Policy) HasEffectiveFrom() bool`

HasEffectiveFrom returns a boolean if a field has been set.

### SetEffectiveFromNil

`func (o *Policy) SetEffectiveFromNil(b bool)`

 SetEffectiveFromNil sets the value for EffectiveFrom to be an explicit nil

### UnsetEffectiveFrom
`func (o *Policy) UnsetEffectiveFrom()`

UnsetEffectiveFrom ensures that no value is present for EffectiveFrom, not even an explicit nil
### GetExpiresAt

`func (o *Policy) GetExpiresAt() ExpiresAt`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *Policy) GetExpiresAtOk() (*ExpiresAt, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *Policy) SetExpiresAt(v ExpiresAt)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *Policy) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### SetExpiresAtNil

`func (o *Policy) SetExpiresAtNil(b bool)`

 SetExpiresAtNil sets the value for ExpiresAt to be an explicit nil

### UnsetExpiresAt
`func (o *Policy) UnsetExpiresAt()`

UnsetExpiresAt ensures that no value is present for ExpiresAt, not even an explicit nil
### GetTags

`func (o *Policy) GetTags() []string`

GetTags returns the Tags field if non-nil, zero value otherwise.

### GetTagsOk

`func (o *Policy) GetTagsOk() (*[]string, bool)`

GetTagsOk returns a tuple with the Tags field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTags

`func (o *Policy) SetTags(v []string)`

SetTags sets Tags field to given value.

### HasTags

`func (o *Policy) HasTags() bool`

HasTags returns a boolean if a field has been set.

### GetScope

`func (o *Policy) GetScope() PolicyScope`

GetScope returns the Scope field if non-nil, zero value otherwise.

### GetScopeOk

`func (o *Policy) GetScopeOk() (*PolicyScope, bool)`

GetScopeOk returns a tuple with the Scope field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScope

`func (o *Policy) SetScope(v PolicyScope)`

SetScope sets Scope field to given value.

### HasScope

`func (o *Policy) HasScope() bool`

HasScope returns a boolean if a field has been set.

### GetRules

`func (o *Policy) GetRules() []PolicyRule`

GetRules returns the Rules field if non-nil, zero value otherwise.

### GetRulesOk

`func (o *Policy) GetRulesOk() (*[]PolicyRule, bool)`

GetRulesOk returns a tuple with the Rules field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRules

`func (o *Policy) SetRules(v []PolicyRule)`

SetRules sets Rules field to given value.


### GetDsar

`func (o *Policy) GetDsar() DsarConfig`

GetDsar returns the Dsar field if non-nil, zero value otherwise.

### GetDsarOk

`func (o *Policy) GetDsarOk() (*DsarConfig, bool)`

GetDsarOk returns a tuple with the Dsar field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDsar

`func (o *Policy) SetDsar(v DsarConfig)`

SetDsar sets Dsar field to given value.

### HasDsar

`func (o *Policy) HasDsar() bool`

HasDsar returns a boolean if a field has been set.

### SetDsarNil

`func (o *Policy) SetDsarNil(b bool)`

 SetDsarNil sets the value for Dsar to be an explicit nil

### UnsetDsar
`func (o *Policy) UnsetDsar()`

UnsetDsar ensures that no value is present for Dsar, not even an explicit nil
### GetAudit

`func (o *Policy) GetAudit() AuditConfig`

GetAudit returns the Audit field if non-nil, zero value otherwise.

### GetAuditOk

`func (o *Policy) GetAuditOk() (*AuditConfig, bool)`

GetAuditOk returns a tuple with the Audit field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAudit

`func (o *Policy) SetAudit(v AuditConfig)`

SetAudit sets Audit field to given value.

### HasAudit

`func (o *Policy) HasAudit() bool`

HasAudit returns a boolean if a field has been set.

### SetAuditNil

`func (o *Policy) SetAuditNil(b bool)`

 SetAuditNil sets the value for Audit to be an explicit nil

### UnsetAudit
`func (o *Policy) UnsetAudit()`

UnsetAudit ensures that no value is present for Audit, not even an explicit nil
### GetReferenceSources

`func (o *Policy) GetReferenceSources() []ReferenceSource`

GetReferenceSources returns the ReferenceSources field if non-nil, zero value otherwise.

### GetReferenceSourcesOk

`func (o *Policy) GetReferenceSourcesOk() (*[]ReferenceSource, bool)`

GetReferenceSourcesOk returns a tuple with the ReferenceSources field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReferenceSources

`func (o *Policy) SetReferenceSources(v []ReferenceSource)`

SetReferenceSources sets ReferenceSources field to given value.

### HasReferenceSources

`func (o *Policy) HasReferenceSources() bool`

HasReferenceSources returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


