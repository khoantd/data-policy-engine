# \GraceHoldsAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CancelGraceHoldApiV1GraceHoldsHoldIdCancelPost**](GraceHoldsAPI.md#CancelGraceHoldApiV1GraceHoldsHoldIdCancelPost) | **Post** /api/v1/grace-holds/{hold_id}/cancel | Cancel Grace Hold
[**ForceGraceHoldApiV1GraceHoldsHoldIdForcePost**](GraceHoldsAPI.md#ForceGraceHoldApiV1GraceHoldsHoldIdForcePost) | **Post** /api/v1/grace-holds/{hold_id}/force | Force Grace Hold
[**GetGraceHoldApiV1GraceHoldsHoldIdGet**](GraceHoldsAPI.md#GetGraceHoldApiV1GraceHoldsHoldIdGet) | **Get** /api/v1/grace-holds/{hold_id} | Get Grace Hold
[**ListGraceHoldsApiV1GraceHoldsGet**](GraceHoldsAPI.md#ListGraceHoldsApiV1GraceHoldsGet) | **Get** /api/v1/grace-holds | List Grace Holds



## CancelGraceHoldApiV1GraceHoldsHoldIdCancelPost

> GraceHold CancelGraceHoldApiV1GraceHoldsHoldIdCancelPost(ctx, holdId).GraceHoldActionRequest(graceHoldActionRequest).Execute()

Cancel Grace Hold

### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/drpe/drpe/drpe"
)

func main() {
	holdId := "holdId_example" // string | 
	graceHoldActionRequest := *openapiclient.NewGraceHoldActionRequest() // GraceHoldActionRequest |  (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.GraceHoldsAPI.CancelGraceHoldApiV1GraceHoldsHoldIdCancelPost(context.Background(), holdId).GraceHoldActionRequest(graceHoldActionRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GraceHoldsAPI.CancelGraceHoldApiV1GraceHoldsHoldIdCancelPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CancelGraceHoldApiV1GraceHoldsHoldIdCancelPost`: GraceHold
	fmt.Fprintf(os.Stdout, "Response from `GraceHoldsAPI.CancelGraceHoldApiV1GraceHoldsHoldIdCancelPost`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**holdId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiCancelGraceHoldApiV1GraceHoldsHoldIdCancelPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **graceHoldActionRequest** | [**GraceHoldActionRequest**](GraceHoldActionRequest.md) |  | 

### Return type

[**GraceHold**](GraceHold.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ForceGraceHoldApiV1GraceHoldsHoldIdForcePost

> GraceHold ForceGraceHoldApiV1GraceHoldsHoldIdForcePost(ctx, holdId).GraceHoldActionRequest(graceHoldActionRequest).Execute()

Force Grace Hold

### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/drpe/drpe/drpe"
)

func main() {
	holdId := "holdId_example" // string | 
	graceHoldActionRequest := *openapiclient.NewGraceHoldActionRequest() // GraceHoldActionRequest |  (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.GraceHoldsAPI.ForceGraceHoldApiV1GraceHoldsHoldIdForcePost(context.Background(), holdId).GraceHoldActionRequest(graceHoldActionRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GraceHoldsAPI.ForceGraceHoldApiV1GraceHoldsHoldIdForcePost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ForceGraceHoldApiV1GraceHoldsHoldIdForcePost`: GraceHold
	fmt.Fprintf(os.Stdout, "Response from `GraceHoldsAPI.ForceGraceHoldApiV1GraceHoldsHoldIdForcePost`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**holdId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiForceGraceHoldApiV1GraceHoldsHoldIdForcePostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **graceHoldActionRequest** | [**GraceHoldActionRequest**](GraceHoldActionRequest.md) |  | 

### Return type

[**GraceHold**](GraceHold.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetGraceHoldApiV1GraceHoldsHoldIdGet

> GraceHold GetGraceHoldApiV1GraceHoldsHoldIdGet(ctx, holdId).Execute()

Get Grace Hold

### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/drpe/drpe/drpe"
)

func main() {
	holdId := "holdId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.GraceHoldsAPI.GetGraceHoldApiV1GraceHoldsHoldIdGet(context.Background(), holdId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GraceHoldsAPI.GetGraceHoldApiV1GraceHoldsHoldIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetGraceHoldApiV1GraceHoldsHoldIdGet`: GraceHold
	fmt.Fprintf(os.Stdout, "Response from `GraceHoldsAPI.GetGraceHoldApiV1GraceHoldsHoldIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**holdId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetGraceHoldApiV1GraceHoldsHoldIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**GraceHold**](GraceHold.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListGraceHoldsApiV1GraceHoldsGet

> []GraceHold ListGraceHoldsApiV1GraceHoldsGet(ctx).Status(status).PolicyId(policyId).RecordId(recordId).RuleId(ruleId).Limit(limit).Offset(offset).Execute()

List Grace Holds

### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
	openapiclient "github.com/drpe/drpe/drpe"
)

func main() {
	status := openapiclient.GraceHoldStatus("active") // GraceHoldStatus |  (optional)
	policyId := "policyId_example" // string |  (optional)
	recordId := "recordId_example" // string |  (optional)
	ruleId := "ruleId_example" // string |  (optional)
	limit := int32(56) // int32 |  (optional) (default to 100)
	offset := int32(56) // int32 |  (optional) (default to 0)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.GraceHoldsAPI.ListGraceHoldsApiV1GraceHoldsGet(context.Background()).Status(status).PolicyId(policyId).RecordId(recordId).RuleId(ruleId).Limit(limit).Offset(offset).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GraceHoldsAPI.ListGraceHoldsApiV1GraceHoldsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListGraceHoldsApiV1GraceHoldsGet`: []GraceHold
	fmt.Fprintf(os.Stdout, "Response from `GraceHoldsAPI.ListGraceHoldsApiV1GraceHoldsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListGraceHoldsApiV1GraceHoldsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | [**GraceHoldStatus**](GraceHoldStatus.md) |  | 
 **policyId** | **string** |  | 
 **recordId** | **string** |  | 
 **ruleId** | **string** |  | 
 **limit** | **int32** |  | [default to 100]
 **offset** | **int32** |  | [default to 0]

### Return type

[**[]GraceHold**](GraceHold.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

