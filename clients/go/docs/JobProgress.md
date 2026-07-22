# JobProgress

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Scanned** | Pointer to **int32** |  | [optional] [default to 0]
**Dispatched** | Pointer to **int32** |  | [optional] [default to 0]
**PendingGrace** | Pointer to **int32** |  | [optional] [default to 0]
**Errors** | Pointer to **int32** |  | [optional] [default to 0]
**Notified** | Pointer to **int32** |  | [optional] [default to 0]

## Methods

### NewJobProgress

`func NewJobProgress() *JobProgress`

NewJobProgress instantiates a new JobProgress object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewJobProgressWithDefaults

`func NewJobProgressWithDefaults() *JobProgress`

NewJobProgressWithDefaults instantiates a new JobProgress object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetScanned

`func (o *JobProgress) GetScanned() int32`

GetScanned returns the Scanned field if non-nil, zero value otherwise.

### GetScannedOk

`func (o *JobProgress) GetScannedOk() (*int32, bool)`

GetScannedOk returns a tuple with the Scanned field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetScanned

`func (o *JobProgress) SetScanned(v int32)`

SetScanned sets Scanned field to given value.

### HasScanned

`func (o *JobProgress) HasScanned() bool`

HasScanned returns a boolean if a field has been set.

### GetDispatched

`func (o *JobProgress) GetDispatched() int32`

GetDispatched returns the Dispatched field if non-nil, zero value otherwise.

### GetDispatchedOk

`func (o *JobProgress) GetDispatchedOk() (*int32, bool)`

GetDispatchedOk returns a tuple with the Dispatched field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDispatched

`func (o *JobProgress) SetDispatched(v int32)`

SetDispatched sets Dispatched field to given value.

### HasDispatched

`func (o *JobProgress) HasDispatched() bool`

HasDispatched returns a boolean if a field has been set.

### GetPendingGrace

`func (o *JobProgress) GetPendingGrace() int32`

GetPendingGrace returns the PendingGrace field if non-nil, zero value otherwise.

### GetPendingGraceOk

`func (o *JobProgress) GetPendingGraceOk() (*int32, bool)`

GetPendingGraceOk returns a tuple with the PendingGrace field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPendingGrace

`func (o *JobProgress) SetPendingGrace(v int32)`

SetPendingGrace sets PendingGrace field to given value.

### HasPendingGrace

`func (o *JobProgress) HasPendingGrace() bool`

HasPendingGrace returns a boolean if a field has been set.

### GetErrors

`func (o *JobProgress) GetErrors() int32`

GetErrors returns the Errors field if non-nil, zero value otherwise.

### GetErrorsOk

`func (o *JobProgress) GetErrorsOk() (*int32, bool)`

GetErrorsOk returns a tuple with the Errors field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetErrors

`func (o *JobProgress) SetErrors(v int32)`

SetErrors sets Errors field to given value.

### HasErrors

`func (o *JobProgress) HasErrors() bool`

HasErrors returns a boolean if a field has been set.

### GetNotified

`func (o *JobProgress) GetNotified() int32`

GetNotified returns the Notified field if non-nil, zero value otherwise.

### GetNotifiedOk

`func (o *JobProgress) GetNotifiedOk() (*int32, bool)`

GetNotifiedOk returns a tuple with the Notified field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetNotified

`func (o *JobProgress) SetNotified(v int32)`

SetNotified sets Notified field to given value.

### HasNotified

`func (o *JobProgress) HasNotified() bool`

HasNotified returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


