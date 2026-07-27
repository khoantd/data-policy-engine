# GuardEventModel

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Kind** | **string** |  | 
**ObservationPoint** | **string** |  | 
**Subject** | Pointer to **map[string]interface{}** |  | [optional] 
**Payload** | Pointer to **map[string]interface{}** |  | [optional] 
**EventId** | **string** |  | 
**GuardId** | **string** |  | 
**Timestamp** | **string** |  | 
**SessionId** | Pointer to **NullableString** |  | [optional] 
**LlmProtocol** | Pointer to **NullableString** |  | [optional] 
**ContextRefs** | Pointer to **[]string** |  | [optional] 
**Provenance** | Pointer to [**[]ProvenanceModel**](ProvenanceModel.md) |  | [optional] 
**OgrVersion** | Pointer to **string** |  | [optional] [default to "0.1"]

## Methods

### NewGuardEventModel

`func NewGuardEventModel(kind string, observationPoint string, eventId string, guardId string, timestamp string, ) *GuardEventModel`

NewGuardEventModel instantiates a new GuardEventModel object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewGuardEventModelWithDefaults

`func NewGuardEventModelWithDefaults() *GuardEventModel`

NewGuardEventModelWithDefaults instantiates a new GuardEventModel object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetKind

`func (o *GuardEventModel) GetKind() string`

GetKind returns the Kind field if non-nil, zero value otherwise.

### GetKindOk

`func (o *GuardEventModel) GetKindOk() (*string, bool)`

GetKindOk returns a tuple with the Kind field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetKind

`func (o *GuardEventModel) SetKind(v string)`

SetKind sets Kind field to given value.


### GetObservationPoint

`func (o *GuardEventModel) GetObservationPoint() string`

GetObservationPoint returns the ObservationPoint field if non-nil, zero value otherwise.

### GetObservationPointOk

`func (o *GuardEventModel) GetObservationPointOk() (*string, bool)`

GetObservationPointOk returns a tuple with the ObservationPoint field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetObservationPoint

`func (o *GuardEventModel) SetObservationPoint(v string)`

SetObservationPoint sets ObservationPoint field to given value.


### GetSubject

`func (o *GuardEventModel) GetSubject() map[string]interface{}`

GetSubject returns the Subject field if non-nil, zero value otherwise.

### GetSubjectOk

`func (o *GuardEventModel) GetSubjectOk() (*map[string]interface{}, bool)`

GetSubjectOk returns a tuple with the Subject field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSubject

`func (o *GuardEventModel) SetSubject(v map[string]interface{})`

SetSubject sets Subject field to given value.

### HasSubject

`func (o *GuardEventModel) HasSubject() bool`

HasSubject returns a boolean if a field has been set.

### GetPayload

`func (o *GuardEventModel) GetPayload() map[string]interface{}`

GetPayload returns the Payload field if non-nil, zero value otherwise.

### GetPayloadOk

`func (o *GuardEventModel) GetPayloadOk() (*map[string]interface{}, bool)`

GetPayloadOk returns a tuple with the Payload field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPayload

`func (o *GuardEventModel) SetPayload(v map[string]interface{})`

SetPayload sets Payload field to given value.

### HasPayload

`func (o *GuardEventModel) HasPayload() bool`

HasPayload returns a boolean if a field has been set.

### GetEventId

`func (o *GuardEventModel) GetEventId() string`

GetEventId returns the EventId field if non-nil, zero value otherwise.

### GetEventIdOk

`func (o *GuardEventModel) GetEventIdOk() (*string, bool)`

GetEventIdOk returns a tuple with the EventId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEventId

`func (o *GuardEventModel) SetEventId(v string)`

SetEventId sets EventId field to given value.


### GetGuardId

`func (o *GuardEventModel) GetGuardId() string`

GetGuardId returns the GuardId field if non-nil, zero value otherwise.

### GetGuardIdOk

`func (o *GuardEventModel) GetGuardIdOk() (*string, bool)`

GetGuardIdOk returns a tuple with the GuardId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetGuardId

`func (o *GuardEventModel) SetGuardId(v string)`

SetGuardId sets GuardId field to given value.


### GetTimestamp

`func (o *GuardEventModel) GetTimestamp() string`

GetTimestamp returns the Timestamp field if non-nil, zero value otherwise.

### GetTimestampOk

`func (o *GuardEventModel) GetTimestampOk() (*string, bool)`

GetTimestampOk returns a tuple with the Timestamp field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetTimestamp

`func (o *GuardEventModel) SetTimestamp(v string)`

SetTimestamp sets Timestamp field to given value.


### GetSessionId

`func (o *GuardEventModel) GetSessionId() string`

GetSessionId returns the SessionId field if non-nil, zero value otherwise.

### GetSessionIdOk

`func (o *GuardEventModel) GetSessionIdOk() (*string, bool)`

GetSessionIdOk returns a tuple with the SessionId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSessionId

`func (o *GuardEventModel) SetSessionId(v string)`

SetSessionId sets SessionId field to given value.

### HasSessionId

`func (o *GuardEventModel) HasSessionId() bool`

HasSessionId returns a boolean if a field has been set.

### SetSessionIdNil

`func (o *GuardEventModel) SetSessionIdNil(b bool)`

 SetSessionIdNil sets the value for SessionId to be an explicit nil

### UnsetSessionId
`func (o *GuardEventModel) UnsetSessionId()`

UnsetSessionId ensures that no value is present for SessionId, not even an explicit nil
### GetLlmProtocol

`func (o *GuardEventModel) GetLlmProtocol() string`

GetLlmProtocol returns the LlmProtocol field if non-nil, zero value otherwise.

### GetLlmProtocolOk

`func (o *GuardEventModel) GetLlmProtocolOk() (*string, bool)`

GetLlmProtocolOk returns a tuple with the LlmProtocol field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetLlmProtocol

`func (o *GuardEventModel) SetLlmProtocol(v string)`

SetLlmProtocol sets LlmProtocol field to given value.

### HasLlmProtocol

`func (o *GuardEventModel) HasLlmProtocol() bool`

HasLlmProtocol returns a boolean if a field has been set.

### SetLlmProtocolNil

`func (o *GuardEventModel) SetLlmProtocolNil(b bool)`

 SetLlmProtocolNil sets the value for LlmProtocol to be an explicit nil

### UnsetLlmProtocol
`func (o *GuardEventModel) UnsetLlmProtocol()`

UnsetLlmProtocol ensures that no value is present for LlmProtocol, not even an explicit nil
### GetContextRefs

`func (o *GuardEventModel) GetContextRefs() []string`

GetContextRefs returns the ContextRefs field if non-nil, zero value otherwise.

### GetContextRefsOk

`func (o *GuardEventModel) GetContextRefsOk() (*[]string, bool)`

GetContextRefsOk returns a tuple with the ContextRefs field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetContextRefs

`func (o *GuardEventModel) SetContextRefs(v []string)`

SetContextRefs sets ContextRefs field to given value.

### HasContextRefs

`func (o *GuardEventModel) HasContextRefs() bool`

HasContextRefs returns a boolean if a field has been set.

### GetProvenance

`func (o *GuardEventModel) GetProvenance() []ProvenanceModel`

GetProvenance returns the Provenance field if non-nil, zero value otherwise.

### GetProvenanceOk

`func (o *GuardEventModel) GetProvenanceOk() (*[]ProvenanceModel, bool)`

GetProvenanceOk returns a tuple with the Provenance field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProvenance

`func (o *GuardEventModel) SetProvenance(v []ProvenanceModel)`

SetProvenance sets Provenance field to given value.

### HasProvenance

`func (o *GuardEventModel) HasProvenance() bool`

HasProvenance returns a boolean if a field has been set.

### GetOgrVersion

`func (o *GuardEventModel) GetOgrVersion() string`

GetOgrVersion returns the OgrVersion field if non-nil, zero value otherwise.

### GetOgrVersionOk

`func (o *GuardEventModel) GetOgrVersionOk() (*string, bool)`

GetOgrVersionOk returns a tuple with the OgrVersion field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOgrVersion

`func (o *GuardEventModel) SetOgrVersion(v string)`

SetOgrVersion sets OgrVersion field to given value.

### HasOgrVersion

`func (o *GuardEventModel) HasOgrVersion() bool`

HasOgrVersion returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


