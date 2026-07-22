# ClassificationResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**RecordId** | **string** |  | 
**ClassificationId** | **string** |  | 
**DetectedEntities** | Pointer to [**[]DetectedEntity**](DetectedEntity.md) |  | [optional] 
**Result** | [**ClassificationResultDetail**](ClassificationResultDetail.md) |  | 
**Diagnostics** | Pointer to [**ClassificationDiagnostics**](ClassificationDiagnostics.md) |  | [optional] 
**JurisdictionApplied** | Pointer to **NullableString** |  | [optional] 
**ClassifiedAt** | **string** |  | 
**AuditRef** | Pointer to **NullableString** |  | [optional] 

## Methods

### NewClassificationResponse

`func NewClassificationResponse(recordId string, classificationId string, result ClassificationResultDetail, classifiedAt string, ) *ClassificationResponse`

NewClassificationResponse instantiates a new ClassificationResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewClassificationResponseWithDefaults

`func NewClassificationResponseWithDefaults() *ClassificationResponse`

NewClassificationResponseWithDefaults instantiates a new ClassificationResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRecordId

`func (o *ClassificationResponse) GetRecordId() string`

GetRecordId returns the RecordId field if non-nil, zero value otherwise.

### GetRecordIdOk

`func (o *ClassificationResponse) GetRecordIdOk() (*string, bool)`

GetRecordIdOk returns a tuple with the RecordId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecordId

`func (o *ClassificationResponse) SetRecordId(v string)`

SetRecordId sets RecordId field to given value.


### GetClassificationId

`func (o *ClassificationResponse) GetClassificationId() string`

GetClassificationId returns the ClassificationId field if non-nil, zero value otherwise.

### GetClassificationIdOk

`func (o *ClassificationResponse) GetClassificationIdOk() (*string, bool)`

GetClassificationIdOk returns a tuple with the ClassificationId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetClassificationId

`func (o *ClassificationResponse) SetClassificationId(v string)`

SetClassificationId sets ClassificationId field to given value.


### GetDetectedEntities

`func (o *ClassificationResponse) GetDetectedEntities() []DetectedEntity`

GetDetectedEntities returns the DetectedEntities field if non-nil, zero value otherwise.

### GetDetectedEntitiesOk

`func (o *ClassificationResponse) GetDetectedEntitiesOk() (*[]DetectedEntity, bool)`

GetDetectedEntitiesOk returns a tuple with the DetectedEntities field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDetectedEntities

`func (o *ClassificationResponse) SetDetectedEntities(v []DetectedEntity)`

SetDetectedEntities sets DetectedEntities field to given value.

### HasDetectedEntities

`func (o *ClassificationResponse) HasDetectedEntities() bool`

HasDetectedEntities returns a boolean if a field has been set.

### GetResult

`func (o *ClassificationResponse) GetResult() ClassificationResultDetail`

GetResult returns the Result field if non-nil, zero value otherwise.

### GetResultOk

`func (o *ClassificationResponse) GetResultOk() (*ClassificationResultDetail, bool)`

GetResultOk returns a tuple with the Result field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetResult

`func (o *ClassificationResponse) SetResult(v ClassificationResultDetail)`

SetResult sets Result field to given value.


### GetDiagnostics

`func (o *ClassificationResponse) GetDiagnostics() ClassificationDiagnostics`

GetDiagnostics returns the Diagnostics field if non-nil, zero value otherwise.

### GetDiagnosticsOk

`func (o *ClassificationResponse) GetDiagnosticsOk() (*ClassificationDiagnostics, bool)`

GetDiagnosticsOk returns a tuple with the Diagnostics field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDiagnostics

`func (o *ClassificationResponse) SetDiagnostics(v ClassificationDiagnostics)`

SetDiagnostics sets Diagnostics field to given value.

### HasDiagnostics

`func (o *ClassificationResponse) HasDiagnostics() bool`

HasDiagnostics returns a boolean if a field has been set.

### GetJurisdictionApplied

`func (o *ClassificationResponse) GetJurisdictionApplied() string`

GetJurisdictionApplied returns the JurisdictionApplied field if non-nil, zero value otherwise.

### GetJurisdictionAppliedOk

`func (o *ClassificationResponse) GetJurisdictionAppliedOk() (*string, bool)`

GetJurisdictionAppliedOk returns a tuple with the JurisdictionApplied field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetJurisdictionApplied

`func (o *ClassificationResponse) SetJurisdictionApplied(v string)`

SetJurisdictionApplied sets JurisdictionApplied field to given value.

### HasJurisdictionApplied

`func (o *ClassificationResponse) HasJurisdictionApplied() bool`

HasJurisdictionApplied returns a boolean if a field has been set.

### SetJurisdictionAppliedNil

`func (o *ClassificationResponse) SetJurisdictionAppliedNil(b bool)`

 SetJurisdictionAppliedNil sets the value for JurisdictionApplied to be an explicit nil

### UnsetJurisdictionApplied
`func (o *ClassificationResponse) UnsetJurisdictionApplied()`

UnsetJurisdictionApplied ensures that no value is present for JurisdictionApplied, not even an explicit nil
### GetClassifiedAt

`func (o *ClassificationResponse) GetClassifiedAt() string`

GetClassifiedAt returns the ClassifiedAt field if non-nil, zero value otherwise.

### GetClassifiedAtOk

`func (o *ClassificationResponse) GetClassifiedAtOk() (*string, bool)`

GetClassifiedAtOk returns a tuple with the ClassifiedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetClassifiedAt

`func (o *ClassificationResponse) SetClassifiedAt(v string)`

SetClassifiedAt sets ClassifiedAt field to given value.


### GetAuditRef

`func (o *ClassificationResponse) GetAuditRef() string`

GetAuditRef returns the AuditRef field if non-nil, zero value otherwise.

### GetAuditRefOk

`func (o *ClassificationResponse) GetAuditRefOk() (*string, bool)`

GetAuditRefOk returns a tuple with the AuditRef field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetAuditRef

`func (o *ClassificationResponse) SetAuditRef(v string)`

SetAuditRef sets AuditRef field to given value.

### HasAuditRef

`func (o *ClassificationResponse) HasAuditRef() bool`

HasAuditRef returns a boolean if a field has been set.

### SetAuditRefNil

`func (o *ClassificationResponse) SetAuditRefNil(b bool)`

 SetAuditRefNil sets the value for AuditRef to be an explicit nil

### UnsetAuditRef
`func (o *ClassificationResponse) UnsetAuditRef()`

UnsetAuditRef ensures that no value is present for AuditRef, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


