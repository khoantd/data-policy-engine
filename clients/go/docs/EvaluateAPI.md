# \EvaluateAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**EvaluateBatchApiV1EvaluateBatchPost**](EvaluateAPI.md#EvaluateBatchApiV1EvaluateBatchPost) | **Post** /api/v1/evaluate/batch | Evaluate Batch
[**EvaluateDryRunApiV1EvaluateDryRunPost**](EvaluateAPI.md#EvaluateDryRunApiV1EvaluateDryRunPost) | **Post** /api/v1/evaluate/dry-run | Evaluate Dry Run
[**EvaluateOneApiV1EvaluatePost**](EvaluateAPI.md#EvaluateOneApiV1EvaluatePost) | **Post** /api/v1/evaluate | Evaluate One



## EvaluateBatchApiV1EvaluateBatchPost

> []EvaluationResponse EvaluateBatchApiV1EvaluateBatchPost(ctx).BatchEvaluateRequest(batchEvaluateRequest).Execute()

Evaluate Batch

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
	batchEvaluateRequest := *openapiclient.NewBatchEvaluateRequest([]openapiclient.EvaluationRequest{*openapiclient.NewEvaluationRequest("DataType_example", "RecordId_example")}) // BatchEvaluateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.EvaluateAPI.EvaluateBatchApiV1EvaluateBatchPost(context.Background()).BatchEvaluateRequest(batchEvaluateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `EvaluateAPI.EvaluateBatchApiV1EvaluateBatchPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `EvaluateBatchApiV1EvaluateBatchPost`: []EvaluationResponse
	fmt.Fprintf(os.Stdout, "Response from `EvaluateAPI.EvaluateBatchApiV1EvaluateBatchPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiEvaluateBatchApiV1EvaluateBatchPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **batchEvaluateRequest** | [**BatchEvaluateRequest**](BatchEvaluateRequest.md) |  | 

### Return type

[**[]EvaluationResponse**](EvaluationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## EvaluateDryRunApiV1EvaluateDryRunPost

> EvaluationResponse EvaluateDryRunApiV1EvaluateDryRunPost(ctx).EvaluationRequest(evaluationRequest).Execute()

Evaluate Dry Run

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
	evaluationRequest := *openapiclient.NewEvaluationRequest("DataType_example", "RecordId_example") // EvaluationRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.EvaluateAPI.EvaluateDryRunApiV1EvaluateDryRunPost(context.Background()).EvaluationRequest(evaluationRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `EvaluateAPI.EvaluateDryRunApiV1EvaluateDryRunPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `EvaluateDryRunApiV1EvaluateDryRunPost`: EvaluationResponse
	fmt.Fprintf(os.Stdout, "Response from `EvaluateAPI.EvaluateDryRunApiV1EvaluateDryRunPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiEvaluateDryRunApiV1EvaluateDryRunPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **evaluationRequest** | [**EvaluationRequest**](EvaluationRequest.md) |  | 

### Return type

[**EvaluationResponse**](EvaluationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## EvaluateOneApiV1EvaluatePost

> EvaluationResponse EvaluateOneApiV1EvaluatePost(ctx).EvaluationRequest(evaluationRequest).Execute()

Evaluate One

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
	evaluationRequest := *openapiclient.NewEvaluationRequest("DataType_example", "RecordId_example") // EvaluationRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.EvaluateAPI.EvaluateOneApiV1EvaluatePost(context.Background()).EvaluationRequest(evaluationRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `EvaluateAPI.EvaluateOneApiV1EvaluatePost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `EvaluateOneApiV1EvaluatePost`: EvaluationResponse
	fmt.Fprintf(os.Stdout, "Response from `EvaluateAPI.EvaluateOneApiV1EvaluatePost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiEvaluateOneApiV1EvaluatePostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **evaluationRequest** | [**EvaluationRequest**](EvaluationRequest.md) |  | 

### Return type

[**EvaluationResponse**](EvaluationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

