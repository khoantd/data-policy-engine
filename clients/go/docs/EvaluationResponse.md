# EvaluationResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**RecordId** | **string** |  | 
**EvaluationId** | **string** |  | 
**Result** | [**EvaluationResultDetail**](EvaluationResultDetail.md) |  | 
**ConflictingPolicies** | Pointer to [**[]ConflictingPolicy**](ConflictingPolicy.md) |  | [optional] 
**JurisdictionApplied** | Pointer to **NullableString** |  | [optional] 
**EvaluatedAt** | **string** |  | 
**AuditRef** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewEvaluationResponse

`func NewEvaluationResponse(recordId string, evaluationId string, result EvaluationResultDetail, evaluatedAt string, ) *EvaluationResponse`

NewEvaluationResponse instantiates a new EvaluationResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewEvaluationResponseWithDefaults

`func NewEvaluationResponseWithDefaults() *EvaluationResponse`

NewEvaluationResponseWithDefaults instantiates a new EvaluationResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRecordId

`func (o *EvaluationResponse) GetRecordId() string`

GetRecordId returns the RecordId field if non-nil, zero value otherwise.

### GetRecordIdOk

`func (o *EvaluationResponse) GetRecordIdOk() (*string, bool)`

GetRecordIdOk returns a tuple with the RecordId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecordId

`func (o *EvaluationResponse) SetRecordId(v string)`

SetRecordId sets RecordId field to given value.


### GetEvaluationId

`func (o *EvaluationResponse) GetEvaluationId() string`

GetEvaluationId returns the EvaluationId field if non-nil, zero value otherwise.

### GetEvaluationIdOk

`func (o *EvaluationResponse) GetEvaluationIdOk() (*string, bool)`

GetEvaluationIdOk returns a tuple with the EvaluationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEvaluationId

`func (o *EvaluationResponse) SetEvaluationId(v string)`

SetEvaluationId sets EvaluationId field to given value.


### GetResult

`func (o *EvaluationResponse) GetResult() EvaluationResultDetail`

GetResult returns the Result field if non-nil, zero value otherwise.

### GetResultOk

`func (o *EvaluationResponse) GetResultOk() (*EvaluationResultDetail, bool)`

GetResultOk returns a tuple with the Result field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResult

`func (o *EvaluationResponse) SetResult(v EvaluationResultDetail)`

SetResult sets Result field to given value.


### GetConflictingPolicies

`func (o *EvaluationResponse) GetConflictingPolicies() []ConflictingPolicy`

GetConflictingPolicies returns the ConflictingPolicies field if non-nil, zero value otherwise.

### GetConflictingPoliciesOk

`func (o *EvaluationResponse) GetConflictingPoliciesOk() (*[]ConflictingPolicy, bool)`

GetConflictingPoliciesOk returns a tuple with the ConflictingPolicies field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetConflictingPolicies

`func (o *EvaluationResponse) SetConflictingPolicies(v []ConflictingPolicy)`

SetConflictingPolicies sets ConflictingPolicies field to given value.

### HasConflictingPolicies

`func (o *EvaluationResponse) HasConflictingPolicies() bool`

HasConflictingPolicies returns a boolean if a field has been set.

### GetJurisdictionApplied

`func (o *EvaluationResponse) GetJurisdictionApplied() string`

GetJurisdictionApplied returns the JurisdictionApplied field if non-nil, zero value otherwise.

### GetJurisdictionAppliedOk

`func (o *EvaluationResponse) GetJurisdictionAppliedOk() (*string, bool)`

GetJurisdictionAppliedOk returns a tuple with the JurisdictionApplied field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetJurisdictionApplied

`func (o *EvaluationResponse) SetJurisdictionApplied(v string)`

SetJurisdictionApplied sets JurisdictionApplied field to given value.

### HasJurisdictionApplied

`func (o *EvaluationResponse) HasJurisdictionApplied() bool`

HasJurisdictionApplied returns a boolean if a field has been set.

### SetJurisdictionAppliedNil

`func (o *EvaluationResponse) SetJurisdictionAppliedNil(b bool)`

 SetJurisdictionAppliedNil sets the value for JurisdictionApplied to be an explicit nil

### UnsetJurisdictionApplied
`func (o *EvaluationResponse) UnsetJurisdictionApplied()`

UnsetJurisdictionApplied ensures that no value is present for JurisdictionApplied, not even an explicit nil
### GetEvaluatedAt

`func (o *EvaluationResponse) GetEvaluatedAt() string`

GetEvaluatedAt returns the EvaluatedAt field if non-nil, zero value otherwise.

### GetEvaluatedAtOk

`func (o *EvaluationResponse) GetEvaluatedAtOk() (*string, bool)`

GetEvaluatedAtOk returns a tuple with the EvaluatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEvaluatedAt

`func (o *EvaluationResponse) SetEvaluatedAt(v string)`

SetEvaluatedAt sets EvaluatedAt field to given value.


### GetAuditRef

`func (o *EvaluationResponse) GetAuditRef() string`

GetAuditRef returns the AuditRef field if non-nil, zero value otherwise.

### GetAuditRefOk

`func (o *EvaluationResponse) GetAuditRefOk() (*string, bool)`

GetAuditRefOk returns a tuple with the AuditRef field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAuditRef

`func (o *EvaluationResponse) SetAuditRef(v string)`

SetAuditRef sets AuditRef field to given value.

### HasAuditRef

`func (o *EvaluationResponse) HasAuditRef() bool`

HasAuditRef returns a boolean if a field has been set.

### SetAuditRefNil

`func (o *EvaluationResponse) SetAuditRefNil(b bool)`

 SetAuditRefNil sets the value for AuditRef to be an explicit nil

### UnsetAuditRef
`func (o *EvaluationResponse) UnsetAuditRef()`

UnsetAuditRef ensures that no value is present for AuditRef, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


