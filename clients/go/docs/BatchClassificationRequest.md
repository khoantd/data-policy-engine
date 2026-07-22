# BatchClassificationRequest

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Records** | [**[]ClassificationRequest**](ClassificationRequest.md) |  | 

## Methods

### NewBatchClassificationRequest

`func NewBatchClassificationRequest(records []ClassificationRequest, ) *BatchClassificationRequest`

NewBatchClassificationRequest instantiates a new BatchClassificationRequest object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewBatchClassificationRequestWithDefaults

`func NewBatchClassificationRequestWithDefaults() *BatchClassificationRequest`

NewBatchClassificationRequestWithDefaults instantiates a new BatchClassificationRequest object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRecords

`func (o *BatchClassificationRequest) GetRecords() []ClassificationRequest`

GetRecords returns the Records field if non-nil, zero value otherwise.

### GetRecordsOk

`func (o *BatchClassificationRequest) GetRecordsOk() (*[]ClassificationRequest, bool)`

GetRecordsOk returns a tuple with the Records field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecords

`func (o *BatchClassificationRequest) SetRecords(v []ClassificationRequest)`

SetRecords sets Records field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


