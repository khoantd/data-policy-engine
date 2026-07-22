# \ClassifyAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ClassifyBatchApiV1ClassifyBatchPost**](ClassifyAPI.md#ClassifyBatchApiV1ClassifyBatchPost) | **Post** /api/v1/classify/batch | Classify Batch
[**ClassifyDryRunApiV1ClassifyDryRunPost**](ClassifyAPI.md#ClassifyDryRunApiV1ClassifyDryRunPost) | **Post** /api/v1/classify/dry-run | Classify Dry Run
[**ClassifyOneApiV1ClassifyPost**](ClassifyAPI.md#ClassifyOneApiV1ClassifyPost) | **Post** /api/v1/classify | Classify One



## ClassifyBatchApiV1ClassifyBatchPost

> []ClassificationResponse ClassifyBatchApiV1ClassifyBatchPost(ctx).BatchClassificationRequest(batchClassificationRequest).Execute()

Classify Batch

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
	batchClassificationRequest := *openapiclient.NewBatchClassificationRequest([]openapiclient.ClassificationRequest{*openapiclient.NewClassificationRequest("DataType_example", "RecordId_example")}) // BatchClassificationRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ClassifyAPI.ClassifyBatchApiV1ClassifyBatchPost(context.Background()).BatchClassificationRequest(batchClassificationRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ClassifyAPI.ClassifyBatchApiV1ClassifyBatchPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ClassifyBatchApiV1ClassifyBatchPost`: []ClassificationResponse
	fmt.Fprintf(os.Stdout, "Response from `ClassifyAPI.ClassifyBatchApiV1ClassifyBatchPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiClassifyBatchApiV1ClassifyBatchPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **batchClassificationRequest** | [**BatchClassificationRequest**](BatchClassificationRequest.md) |  | 

### Return type

[**[]ClassificationResponse**](ClassificationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ClassifyDryRunApiV1ClassifyDryRunPost

> ClassificationResponse ClassifyDryRunApiV1ClassifyDryRunPost(ctx).ClassificationRequest(classificationRequest).Execute()

Classify Dry Run

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
	classificationRequest := *openapiclient.NewClassificationRequest("DataType_example", "RecordId_example") // ClassificationRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ClassifyAPI.ClassifyDryRunApiV1ClassifyDryRunPost(context.Background()).ClassificationRequest(classificationRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ClassifyAPI.ClassifyDryRunApiV1ClassifyDryRunPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ClassifyDryRunApiV1ClassifyDryRunPost`: ClassificationResponse
	fmt.Fprintf(os.Stdout, "Response from `ClassifyAPI.ClassifyDryRunApiV1ClassifyDryRunPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiClassifyDryRunApiV1ClassifyDryRunPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationRequest** | [**ClassificationRequest**](ClassificationRequest.md) |  | 

### Return type

[**ClassificationResponse**](ClassificationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ClassifyOneApiV1ClassifyPost

> ClassificationResponse ClassifyOneApiV1ClassifyPost(ctx).ClassificationRequest(classificationRequest).Execute()

Classify One

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
	classificationRequest := *openapiclient.NewClassificationRequest("DataType_example", "RecordId_example") // ClassificationRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ClassifyAPI.ClassifyOneApiV1ClassifyPost(context.Background()).ClassificationRequest(classificationRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ClassifyAPI.ClassifyOneApiV1ClassifyPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ClassifyOneApiV1ClassifyPost`: ClassificationResponse
	fmt.Fprintf(os.Stdout, "Response from `ClassifyAPI.ClassifyOneApiV1ClassifyPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiClassifyOneApiV1ClassifyPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **classificationRequest** | [**ClassificationRequest**](ClassificationRequest.md) |  | 

### Return type

[**ClassificationResponse**](ClassificationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

