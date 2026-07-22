# ReadyResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Status** | **string** |  | 
**PoliciesLoaded** | **int32** |  | 

## Methods

### NewReadyResponse

`func NewReadyResponse(status string, policiesLoaded int32, ) *ReadyResponse`

NewReadyResponse instantiates a new ReadyResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewReadyResponseWithDefaults

`func NewReadyResponseWithDefaults() *ReadyResponse`

NewReadyResponseWithDefaults instantiates a new ReadyResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetStatus

`func (o *ReadyResponse) GetStatus() string`

GetStatus returns the Status field if non-nil, zero value otherwise.

### GetStatusOk

`func (o *ReadyResponse) GetStatusOk() (*string, bool)`

GetStatusOk returns a tuple with the Status field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetStatus

`func (o *ReadyResponse) SetStatus(v string)`

SetStatus sets Status field to given value.


### GetPoliciesLoaded

`func (o *ReadyResponse) GetPoliciesLoaded() int32`

GetPoliciesLoaded returns the PoliciesLoaded field if non-nil, zero value otherwise.

### GetPoliciesLoadedOk

`func (o *ReadyResponse) GetPoliciesLoadedOk() (*int32, bool)`

GetPoliciesLoadedOk returns a tuple with the PoliciesLoaded field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPoliciesLoaded

`func (o *ReadyResponse) SetPoliciesLoaded(v int32)`

SetPoliciesLoaded sets PoliciesLoaded field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


