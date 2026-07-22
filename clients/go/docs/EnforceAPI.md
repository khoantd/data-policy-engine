# \EnforceAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**GetJobApiV1EnforceJobsJobIdGet**](EnforceAPI.md#GetJobApiV1EnforceJobsJobIdGet) | **Get** /api/v1/enforce/jobs/{job_id} | Get Job
[**ListJobsApiV1EnforceJobsGet**](EnforceAPI.md#ListJobsApiV1EnforceJobsGet) | **Get** /api/v1/enforce/jobs | List Jobs
[**TriggerEnforceApiV1EnforcePost**](EnforceAPI.md#TriggerEnforceApiV1EnforcePost) | **Post** /api/v1/enforce | Trigger Enforce



## GetJobApiV1EnforceJobsJobIdGet

> EnforcementJob GetJobApiV1EnforceJobsJobIdGet(ctx, jobId).Execute()

Get Job

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
	jobId := "jobId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.EnforceAPI.GetJobApiV1EnforceJobsJobIdGet(context.Background(), jobId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `EnforceAPI.GetJobApiV1EnforceJobsJobIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetJobApiV1EnforceJobsJobIdGet`: EnforcementJob
	fmt.Fprintf(os.Stdout, "Response from `EnforceAPI.GetJobApiV1EnforceJobsJobIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**jobId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetJobApiV1EnforceJobsJobIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**EnforcementJob**](EnforcementJob.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListJobsApiV1EnforceJobsGet

> []EnforcementJob ListJobsApiV1EnforceJobsGet(ctx).Status(status).PolicyId(policyId).Limit(limit).Offset(offset).Execute()

List Jobs

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
	status := openapiclient.JobStatus("queued") // JobStatus |  (optional)
	policyId := "policyId_example" // string |  (optional)
	limit := int32(56) // int32 |  (optional) (default to 100)
	offset := int32(56) // int32 |  (optional) (default to 0)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.EnforceAPI.ListJobsApiV1EnforceJobsGet(context.Background()).Status(status).PolicyId(policyId).Limit(limit).Offset(offset).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `EnforceAPI.ListJobsApiV1EnforceJobsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListJobsApiV1EnforceJobsGet`: []EnforcementJob
	fmt.Fprintf(os.Stdout, "Response from `EnforceAPI.ListJobsApiV1EnforceJobsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListJobsApiV1EnforceJobsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | [**JobStatus**](JobStatus.md) |  | 
 **policyId** | **string** |  | 
 **limit** | **int32** |  | [default to 100]
 **offset** | **int32** |  | [default to 0]

### Return type

[**[]EnforcementJob**](EnforcementJob.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## TriggerEnforceApiV1EnforcePost

> EnforceResponse TriggerEnforceApiV1EnforcePost(ctx).EnforceRequest(enforceRequest).Execute()

Trigger Enforce

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
	enforceRequest := *openapiclient.NewEnforceRequest() // EnforceRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.EnforceAPI.TriggerEnforceApiV1EnforcePost(context.Background()).EnforceRequest(enforceRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `EnforceAPI.TriggerEnforceApiV1EnforcePost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `TriggerEnforceApiV1EnforcePost`: EnforceResponse
	fmt.Fprintf(os.Stdout, "Response from `EnforceAPI.TriggerEnforceApiV1EnforcePost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiTriggerEnforceApiV1EnforcePostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **enforceRequest** | [**EnforceRequest**](EnforceRequest.md) |  | 

### Return type

[**EnforceResponse**](EnforceResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

