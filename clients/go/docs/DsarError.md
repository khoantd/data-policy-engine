# DsarError

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**RecordId** | Pointer to **NullableString** |  | [optional] 
**Detail** | **string** |  | 

## Methods

### NewDsarError

`func NewDsarError(detail string, ) *DsarError`

NewDsarError instantiates a new DsarError object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewDsarErrorWithDefaults

`func NewDsarErrorWithDefaults() *DsarError`

NewDsarErrorWithDefaults instantiates a new DsarError object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetRecordId

`func (o *DsarError) GetRecordId() string`

GetRecordId returns the RecordId field if non-nil, zero value otherwise.

### GetRecordIdOk

`func (o *DsarError) GetRecordIdOk() (*string, bool)`

GetRecordIdOk returns a tuple with the RecordId field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetRecordId

`func (o *DsarError) SetRecordId(v string)`

SetRecordId sets RecordId field to given value.

### HasRecordId

`func (o *DsarError) HasRecordId() bool`

HasRecordId returns a boolean if a field has been set.

### SetRecordIdNil

`func (o *DsarError) SetRecordIdNil(b bool)`

 SetRecordIdNil sets the value for RecordId to be an explicit nil

### UnsetRecordId
`func (o *DsarError) UnsetRecordId()`

UnsetRecordId ensures that no value is present for RecordId, not even an explicit nil
### GetDetail

`func (o *DsarError) GetDetail() string`

GetDetail returns the Detail field if non-nil, zero value otherwise.

### GetDetailOk

`func (o *DsarError) GetDetailOk() (*string, bool)`

GetDetailOk returns a tuple with the Detail field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDetail

`func (o *DsarError) SetDetail(v string)`

SetDetail sets Detail field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


