# VerdictResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**EventId** | **string** |  | 
**GuardId** | **string** |  | 
**Provider** | **string** |  | 
**Decision** | **string** |  | 
**Categories** | Pointer to [**[]CategoryModel**](CategoryModel.md) |  | [optional] 
**Reasons** | Pointer to **[]string** |  | [optional] 
**Evidence** | Pointer to **[]map[string]interface{}** |  | [optional] 
**Confidence** | Pointer to **NullableFloat32** |  | [optional] 
**LatencyMs** | Pointer to **NullableFloat32** |  | [optional] 
**OgrVersion** | Pointer to **string** |  | [optional] [default to "0.1"]

## Methods

### NewVerdictResponse

`func NewVerdictResponse(eventId string, guardId string, provider string, decision string, ) *VerdictResponse`

NewVerdictResponse instantiates a new VerdictResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewVerdictResponseWithDefaults

`func NewVerdictResponseWithDefaults() *VerdictResponse`

NewVerdictResponseWithDefaults instantiates a new VerdictResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetEventId

`func (o *VerdictResponse) GetEventId() string`

GetEventId returns the EventId field if non-nil, zero value otherwise.

### GetEventIdOk

`func (o *VerdictResponse) GetEventIdOk() (*string, bool)`

GetEventIdOk returns a tuple with the EventId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventId

`func (o *VerdictResponse) SetEventId(v string)`

SetEventId sets EventId field to given value.


### GetGuardId

`func (o *VerdictResponse) GetGuardId() string`

GetGuardId returns the GuardId field if non-nil, zero value otherwise.

### GetGuardIdOk

`func (o *VerdictResponse) GetGuardIdOk() (*string, bool)`

GetGuardIdOk returns a tuple with the GuardId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGuardId

`func (o *VerdictResponse) SetGuardId(v string)`

SetGuardId sets GuardId field to given value.


### GetProvider

`func (o *VerdictResponse) GetProvider() string`

GetProvider returns the Provider field if non-nil, zero value otherwise.

### GetProviderOk

`func (o *VerdictResponse) GetProviderOk() (*string, bool)`

GetProviderOk returns a tuple with the Provider field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvider

`func (o *VerdictResponse) SetProvider(v string)`

SetProvider sets Provider field to given value.


### GetDecision

`func (o *VerdictResponse) GetDecision() string`

GetDecision returns the Decision field if non-nil, zero value otherwise.

### GetDecisionOk

`func (o *VerdictResponse) GetDecisionOk() (*string, bool)`

GetDecisionOk returns a tuple with the Decision field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDecision

`func (o *VerdictResponse) SetDecision(v string)`

SetDecision sets Decision field to given value.


### GetCategories

`func (o *VerdictResponse) GetCategories() []CategoryModel`

GetCategories returns the Categories field if non-nil, zero value otherwise.

### GetCategoriesOk

`func (o *VerdictResponse) GetCategoriesOk() (*[]CategoryModel, bool)`

GetCategoriesOk returns a tuple with the Categories field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCategories

`func (o *VerdictResponse) SetCategories(v []CategoryModel)`

SetCategories sets Categories field to given value.

### HasCategories

`func (o *VerdictResponse) HasCategories() bool`

HasCategories returns a boolean if a field has been set.

### GetReasons

`func (o *VerdictResponse) GetReasons() []string`

GetReasons returns the Reasons field if non-nil, zero value otherwise.

### GetReasonsOk

`func (o *VerdictResponse) GetReasonsOk() (*[]string, bool)`

GetReasonsOk returns a tuple with the Reasons field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetReasons

`func (o *VerdictResponse) SetReasons(v []string)`

SetReasons sets Reasons field to given value.

### HasReasons

`func (o *VerdictResponse) HasReasons() bool`

HasReasons returns a boolean if a field has been set.

### GetEvidence

`func (o *VerdictResponse) GetEvidence() []map[string]interface{}`

GetEvidence returns the Evidence field if non-nil, zero value otherwise.

### GetEvidenceOk

`func (o *VerdictResponse) GetEvidenceOk() (*[]map[string]interface{}, bool)`

GetEvidenceOk returns a tuple with the Evidence field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEvidence

`func (o *VerdictResponse) SetEvidence(v []map[string]interface{})`

SetEvidence sets Evidence field to given value.

### HasEvidence

`func (o *VerdictResponse) HasEvidence() bool`

HasEvidence returns a boolean if a field has been set.

### GetConfidence

`func (o *VerdictResponse) GetConfidence() float32`

GetConfidence returns the Confidence field if non-nil, zero value otherwise.

### GetConfidenceOk

`func (o *VerdictResponse) GetConfidenceOk() (*float32, bool)`

GetConfidenceOk returns a tuple with the Confidence field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConfidence

`func (o *VerdictResponse) SetConfidence(v float32)`

SetConfidence sets Confidence field to given value.

### HasConfidence

`func (o *VerdictResponse) HasConfidence() bool`

HasConfidence returns a boolean if a field has been set.

### SetConfidenceNil

`func (o *VerdictResponse) SetConfidenceNil(b bool)`

 SetConfidenceNil sets the value for Confidence to be an explicit nil

### UnsetConfidence
`func (o *VerdictResponse) UnsetConfidence()`

UnsetConfidence ensures that no value is present for Confidence, not even an explicit nil
### GetLatencyMs

`func (o *VerdictResponse) GetLatencyMs() float32`

GetLatencyMs returns the LatencyMs field if non-nil, zero value otherwise.

### GetLatencyMsOk

`func (o *VerdictResponse) GetLatencyMsOk() (*float32, bool)`

GetLatencyMsOk returns a tuple with the LatencyMs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLatencyMs

`func (o *VerdictResponse) SetLatencyMs(v float32)`

SetLatencyMs sets LatencyMs field to given value.

### HasLatencyMs

`func (o *VerdictResponse) HasLatencyMs() bool`

HasLatencyMs returns a boolean if a field has been set.

### SetLatencyMsNil

`func (o *VerdictResponse) SetLatencyMsNil(b bool)`

 SetLatencyMsNil sets the value for LatencyMs to be an explicit nil

### UnsetLatencyMs
`func (o *VerdictResponse) UnsetLatencyMs()`

UnsetLatencyMs ensures that no value is present for LatencyMs, not even an explicit nil
### GetOgrVersion

`func (o *VerdictResponse) GetOgrVersion() string`

GetOgrVersion returns the OgrVersion field if non-nil, zero value otherwise.

### GetOgrVersionOk

`func (o *VerdictResponse) GetOgrVersionOk() (*string, bool)`

GetOgrVersionOk returns a tuple with the OgrVersion field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOgrVersion

`func (o *VerdictResponse) SetOgrVersion(v string)`

SetOgrVersion sets OgrVersion field to given value.

### HasOgrVersion

`func (o *VerdictResponse) HasOgrVersion() bool`

HasOgrVersion returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


