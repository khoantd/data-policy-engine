# ClassificationPolicy

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
**Entities** | [**[]ClassificationEntity**](ClassificationEntity.md) |  | 
**Rules** | [**[]ClassificationRule**](ClassificationRule.md) |  | 
**TextFields** | Pointer to **[]string** | Metadata field paths scanned with NER when privalyse is available | [optional] 

## Methods

### NewClassificationPolicy

`func NewClassificationPolicy(id string, name string, jurisdiction string, entities []ClassificationEntity, rules []ClassificationRule, ) *ClassificationPolicy`

NewClassificationPolicy instantiates a new ClassificationPolicy object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewClassificationPolicyWithDefaults

`func NewClassificationPolicyWithDefaults() *ClassificationPolicy`

NewClassificationPolicyWithDefaults instantiates a new ClassificationPolicy object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *ClassificationPolicy) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *ClassificationPolicy) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *ClassificationPolicy) SetId(v string)`

SetId sets Id field to given value.


### GetName

`func (o *ClassificationPolicy) GetName() string`

GetName returns the Name field if non-nil, zero value otherwise.

### GetNameOk

`func (o *ClassificationPolicy) GetNameOk() (*string, bool)`

GetNameOk returns a tuple with the Name field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetName

`func (o *ClassificationPolicy) SetName(v string)`

SetName sets Name field to given value.


### GetVersion

`func (o *ClassificationPolicy) GetVersion() int32`

GetVersion returns the Version field if non-nil, zero value otherwise.

### GetVersionOk

`func (o *ClassificationPolicy) GetVersionOk() (*int32, bool)`

GetVersionOk returns a tuple with the Version field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetVersion

`func (o *ClassificationPolicy) SetVersion(v int32)`

SetVersion sets Version field to given value.

### HasVersion

`func (o *ClassificationPolicy) HasVersion() bool`

HasVersion returns a boolean if a field has been set.

### GetStatus

`func (o *ClassificationPolicy) GetStatus() PolicyStatus`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *ClassificationPolicy) GetStatusOk() (*PolicyStatus, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *ClassificationPolicy) SetStatus(v PolicyStatus)`

SetStatus sets Status field to given value.

### HasStatus

`func (o *ClassificationPolicy) HasStatus() bool`

HasStatus returns a boolean if a field has been set.

### GetJurisdiction

`func (o *ClassificationPolicy) GetJurisdiction() string`

GetJurisdiction returns the Jurisdiction field if non-nil, zero value otherwise.

### GetJurisdictionOk

`func (o *ClassificationPolicy) GetJurisdictionOk() (*string, bool)`

GetJurisdictionOk returns a tuple with the Jurisdiction field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetJurisdiction

`func (o *ClassificationPolicy) SetJurisdiction(v string)`

SetJurisdiction sets Jurisdiction field to given value.


### GetPolicyKind

`func (o *ClassificationPolicy) GetPolicyKind() PolicyKind`

GetPolicyKind returns the PolicyKind field if non-nil, zero value otherwise.

### GetPolicyKindOk

`func (o *ClassificationPolicy) GetPolicyKindOk() (*PolicyKind, bool)`

GetPolicyKindOk returns a tuple with the PolicyKind field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyKind

`func (o *ClassificationPolicy) SetPolicyKind(v PolicyKind)`

SetPolicyKind sets PolicyKind field to given value.

### HasPolicyKind

`func (o *ClassificationPolicy) HasPolicyKind() bool`

HasPolicyKind returns a boolean if a field has been set.

### GetOwner

`func (o *ClassificationPolicy) GetOwner() string`

GetOwner returns the Owner field if non-nil, zero value otherwise.

### GetOwnerOk

`func (o *ClassificationPolicy) GetOwnerOk() (*string, bool)`

GetOwnerOk returns a tuple with the Owner field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOwner

`func (o *ClassificationPolicy) SetOwner(v string)`

SetOwner sets Owner field to given value.

### HasOwner

`func (o *ClassificationPolicy) HasOwner() bool`

HasOwner returns a boolean if a field has been set.

### SetOwnerNil

`func (o *ClassificationPolicy) SetOwnerNil(b bool)`

 SetOwnerNil sets the value for Owner to be an explicit nil

### UnsetOwner
`func (o *ClassificationPolicy) UnsetOwner()`

UnsetOwner ensures that no value is present for Owner, not even an explicit nil
### GetEffectiveFrom

`func (o *ClassificationPolicy) GetEffectiveFrom() EffectiveFrom`

GetEffectiveFrom returns the EffectiveFrom field if non-nil, zero value otherwise.

### GetEffectiveFromOk

`func (o *ClassificationPolicy) GetEffectiveFromOk() (*EffectiveFrom, bool)`

GetEffectiveFromOk returns a tuple with the EffectiveFrom field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEffectiveFrom

`func (o *ClassificationPolicy) SetEffectiveFrom(v EffectiveFrom)`

SetEffectiveFrom sets EffectiveFrom field to given value.

### HasEffectiveFrom

`func (o *ClassificationPolicy) HasEffectiveFrom() bool`

HasEffectiveFrom returns a boolean if a field has been set.

### SetEffectiveFromNil

`func (o *ClassificationPolicy) SetEffectiveFromNil(b bool)`

 SetEffectiveFromNil sets the value for EffectiveFrom to be an explicit nil

### UnsetEffectiveFrom
`func (o *ClassificationPolicy) UnsetEffectiveFrom()`

UnsetEffectiveFrom ensures that no value is present for EffectiveFrom, not even an explicit nil
### GetExpiresAt

`func (o *ClassificationPolicy) GetExpiresAt() ExpiresAt`

GetExpiresAt returns the ExpiresAt field if non-nil, zero value otherwise.

### GetExpiresAtOk

`func (o *ClassificationPolicy) GetExpiresAtOk() (*ExpiresAt, bool)`

GetExpiresAtOk returns a tuple with the ExpiresAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetExpiresAt

`func (o *ClassificationPolicy) SetExpiresAt(v ExpiresAt)`

SetExpiresAt sets ExpiresAt field to given value.

### HasExpiresAt

`func (o *ClassificationPolicy) HasExpiresAt() bool`

HasExpiresAt returns a boolean if a field has been set.

### SetExpiresAtNil

`func (o *ClassificationPolicy) SetExpiresAtNil(b bool)`

 SetExpiresAtNil sets the value for ExpiresAt to be an explicit nil

### UnsetExpiresAt
`func (o *ClassificationPolicy) UnsetExpiresAt()`

UnsetExpiresAt ensures that no value is present for ExpiresAt, not even an explicit nil
### GetTags

`func (o *ClassificationPolicy) GetTags() []string`

GetTags returns the Tags field if non-nil, zero value otherwise.

### GetTagsOk

`func (o *ClassificationPolicy) GetTagsOk() (*[]string, bool)`

GetTagsOk returns a tuple with the Tags field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTags

`func (o *ClassificationPolicy) SetTags(v []string)`

SetTags sets Tags field to given value.

### HasTags

`func (o *ClassificationPolicy) HasTags() bool`

HasTags returns a boolean if a field has been set.

### GetScope

`func (o *ClassificationPolicy) GetScope() PolicyScope`

GetScope returns the Scope field if non-nil, zero value otherwise.

### GetScopeOk

`func (o *ClassificationPolicy) GetScopeOk() (*PolicyScope, bool)`

GetScopeOk returns a tuple with the Scope field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScope

`func (o *ClassificationPolicy) SetScope(v PolicyScope)`

SetScope sets Scope field to given value.

### HasScope

`func (o *ClassificationPolicy) HasScope() bool`

HasScope returns a boolean if a field has been set.

### GetEntities

`func (o *ClassificationPolicy) GetEntities() []ClassificationEntity`

GetEntities returns the Entities field if non-nil, zero value otherwise.

### GetEntitiesOk

`func (o *ClassificationPolicy) GetEntitiesOk() (*[]ClassificationEntity, bool)`

GetEntitiesOk returns a tuple with the Entities field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEntities

`func (o *ClassificationPolicy) SetEntities(v []ClassificationEntity)`

SetEntities sets Entities field to given value.


### GetRules

`func (o *ClassificationPolicy) GetRules() []ClassificationRule`

GetRules returns the Rules field if non-nil, zero value otherwise.

### GetRulesOk

`func (o *ClassificationPolicy) GetRulesOk() (*[]ClassificationRule, bool)`

GetRulesOk returns a tuple with the Rules field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRules

`func (o *ClassificationPolicy) SetRules(v []ClassificationRule)`

SetRules sets Rules field to given value.


### GetTextFields

`func (o *ClassificationPolicy) GetTextFields() []string`

GetTextFields returns the TextFields field if non-nil, zero value otherwise.

### GetTextFieldsOk

`func (o *ClassificationPolicy) GetTextFieldsOk() (*[]string, bool)`

GetTextFieldsOk returns a tuple with the TextFields field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTextFields

`func (o *ClassificationPolicy) SetTextFields(v []string)`

SetTextFields sets TextFields field to given value.

### HasTextFields

`func (o *ClassificationPolicy) HasTextFields() bool`

HasTextFields returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


