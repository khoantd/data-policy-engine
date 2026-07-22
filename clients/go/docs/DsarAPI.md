# \DsarAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**GetRequestApiV1DsarRequestsRequestIdGet**](DsarAPI.md#GetRequestApiV1DsarRequestsRequestIdGet) | **Get** /api/v1/dsar/requests/{request_id} | Get Request
[**ListRequestsApiV1DsarRequestsGet**](DsarAPI.md#ListRequestsApiV1DsarRequestsGet) | **Get** /api/v1/dsar/requests | List Requests
[**SubmitAccessApiV1DsarAccessPost**](DsarAPI.md#SubmitAccessApiV1DsarAccessPost) | **Post** /api/v1/dsar/access | Submit Access
[**SubmitErasureApiV1DsarErasurePost**](DsarAPI.md#SubmitErasureApiV1DsarErasurePost) | **Post** /api/v1/dsar/erasure | Submit Erasure



## GetRequestApiV1DsarRequestsRequestIdGet

> DsarRequest GetRequestApiV1DsarRequestsRequestIdGet(ctx, requestId).Execute()

Get Request

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
	requestId := "requestId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DsarAPI.GetRequestApiV1DsarRequestsRequestIdGet(context.Background(), requestId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DsarAPI.GetRequestApiV1DsarRequestsRequestIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetRequestApiV1DsarRequestsRequestIdGet`: DsarRequest
	fmt.Fprintf(os.Stdout, "Response from `DsarAPI.GetRequestApiV1DsarRequestsRequestIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**requestId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetRequestApiV1DsarRequestsRequestIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**DsarRequest**](DsarRequest.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListRequestsApiV1DsarRequestsGet

> []DsarRequest ListRequestsApiV1DsarRequestsGet(ctx).Type_(type_).Status(status).SubjectId(subjectId).PolicyId(policyId).Limit(limit).Offset(offset).Execute()

List Requests

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
	type_ := openapiclient.DsarRequestType("access") // DsarRequestType |  (optional)
	status := openapiclient.DsarRequestStatus("received") // DsarRequestStatus |  (optional)
	subjectId := "subjectId_example" // string |  (optional)
	policyId := "policyId_example" // string |  (optional)
	limit := int32(56) // int32 |  (optional) (default to 100)
	offset := int32(56) // int32 |  (optional) (default to 0)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DsarAPI.ListRequestsApiV1DsarRequestsGet(context.Background()).Type_(type_).Status(status).SubjectId(subjectId).PolicyId(policyId).Limit(limit).Offset(offset).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DsarAPI.ListRequestsApiV1DsarRequestsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListRequestsApiV1DsarRequestsGet`: []DsarRequest
	fmt.Fprintf(os.Stdout, "Response from `DsarAPI.ListRequestsApiV1DsarRequestsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListRequestsApiV1DsarRequestsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **type_** | [**DsarRequestType**](DsarRequestType.md) |  | 
 **status** | [**DsarRequestStatus**](DsarRequestStatus.md) |  | 
 **subjectId** | **string** |  | 
 **policyId** | **string** |  | 
 **limit** | **int32** |  | [default to 100]
 **offset** | **int32** |  | [default to 0]

### Return type

[**[]DsarRequest**](DsarRequest.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SubmitAccessApiV1DsarAccessPost

> DsarRequest SubmitAccessApiV1DsarAccessPost(ctx).DsarSubmitRequest(dsarSubmitRequest).Execute()

Submit Access

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
	dsarSubmitRequest := *openapiclient.NewDsarSubmitRequest("SubjectId_example", "PolicyId_example") // DsarSubmitRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DsarAPI.SubmitAccessApiV1DsarAccessPost(context.Background()).DsarSubmitRequest(dsarSubmitRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DsarAPI.SubmitAccessApiV1DsarAccessPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SubmitAccessApiV1DsarAccessPost`: DsarRequest
	fmt.Fprintf(os.Stdout, "Response from `DsarAPI.SubmitAccessApiV1DsarAccessPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSubmitAccessApiV1DsarAccessPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dsarSubmitRequest** | [**DsarSubmitRequest**](DsarSubmitRequest.md) |  | 

### Return type

[**DsarRequest**](DsarRequest.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SubmitErasureApiV1DsarErasurePost

> DsarRequest SubmitErasureApiV1DsarErasurePost(ctx).DsarSubmitRequest(dsarSubmitRequest).Execute()

Submit Erasure

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
	dsarSubmitRequest := *openapiclient.NewDsarSubmitRequest("SubjectId_example", "PolicyId_example") // DsarSubmitRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.DsarAPI.SubmitErasureApiV1DsarErasurePost(context.Background()).DsarSubmitRequest(dsarSubmitRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `DsarAPI.SubmitErasureApiV1DsarErasurePost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SubmitErasureApiV1DsarErasurePost`: DsarRequest
	fmt.Fprintf(os.Stdout, "Response from `DsarAPI.SubmitErasureApiV1DsarErasurePost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiSubmitErasureApiV1DsarErasurePostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **dsarSubmitRequest** | [**DsarSubmitRequest**](DsarSubmitRequest.md) |  | 

### Return type

[**DsarRequest**](DsarRequest.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

