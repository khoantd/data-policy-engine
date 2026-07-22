# DsarResult

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Records** | Pointer to [**[]RecordRef**](RecordRef.md) |  | [optional] 
**Erased** | Pointer to **[]string** |  | [optional] 
**Denied** | Pointer to [**[]DsarDeniedRecord**](DsarDeniedRecord.md) |  | [optional] 
**Errors** | Pointer to [**[]DsarError**](DsarError.md) |  | [optional] 

## Methods

### NewDsarResult

`func NewDsarResult() *DsarResult`

NewDsarResult instantiates a new DsarResult object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDsarResultWithDefaults

`func NewDsarResultWithDefaults() *DsarResult`

NewDsarResultWithDefaults instantiates a new DsarResult object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRecords

`func (o *DsarResult) GetRecords() []RecordRef`

GetRecords returns the Records field if non-nil, zero value otherwise.

### GetRecordsOk

`func (o *DsarResult) GetRecordsOk() (*[]RecordRef, bool)`

GetRecordsOk returns a tuple with the Records field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecords

`func (o *DsarResult) SetRecords(v []RecordRef)`

SetRecords sets Records field to given value.

### HasRecords

`func (o *DsarResult) HasRecords() bool`

HasRecords returns a boolean if a field has been set.

### GetErased

`func (o *DsarResult) GetErased() []string`

GetErased returns the Erased field if non-nil, zero value otherwise.

### GetErasedOk

`func (o *DsarResult) GetErasedOk() (*[]string, bool)`

GetErasedOk returns a tuple with the Erased field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetErased

`func (o *DsarResult) SetErased(v []string)`

SetErased sets Erased field to given value.

### HasErased

`func (o *DsarResult) HasErased() bool`

HasErased returns a boolean if a field has been set.

### GetDenied

`func (o *DsarResult) GetDenied() []DsarDeniedRecord`

GetDenied returns the Denied field if non-nil, zero value otherwise.

### GetDeniedOk

`func (o *DsarResult) GetDeniedOk() (*[]DsarDeniedRecord, bool)`

GetDeniedOk returns a tuple with the Denied field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDenied

`func (o *DsarResult) SetDenied(v []DsarDeniedRecord)`

SetDenied sets Denied field to given value.

### HasDenied

`func (o *DsarResult) HasDenied() bool`

HasDenied returns a boolean if a field has been set.

### GetErrors

`func (o *DsarResult) GetErrors() []DsarError`

GetErrors returns the Errors field if non-nil, zero value otherwise.

### GetErrorsOk

`func (o *DsarResult) GetErrorsOk() (*[]DsarError, bool)`

GetErrorsOk returns a tuple with the Errors field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetErrors

`func (o *DsarResult) SetErrors(v []DsarError)`

SetErrors sets Errors field to given value.

### HasErrors

`func (o *DsarResult) HasErrors() bool`

HasErrors returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


