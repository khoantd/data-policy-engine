# \ProcessesAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateProcessApiV1ProcessesPost**](ProcessesAPI.md#CreateProcessApiV1ProcessesPost) | **Post** /api/v1/processes | Create Process
[**DeleteProcessApiV1ProcessesProcessIdDelete**](ProcessesAPI.md#DeleteProcessApiV1ProcessesProcessIdDelete) | **Delete** /api/v1/processes/{process_id} | Delete Process
[**GetProcessApiV1ProcessesProcessIdGet**](ProcessesAPI.md#GetProcessApiV1ProcessesProcessIdGet) | **Get** /api/v1/processes/{process_id} | Get Process
[**ListProcessPoliciesApiV1ProcessesProcessIdPoliciesGet**](ProcessesAPI.md#ListProcessPoliciesApiV1ProcessesProcessIdPoliciesGet) | **Get** /api/v1/processes/{process_id}/policies | List Process Policies
[**ListProcessesApiV1ProcessesGet**](ProcessesAPI.md#ListProcessesApiV1ProcessesGet) | **Get** /api/v1/processes | List Processes
[**SetProcessPoliciesApiV1ProcessesProcessIdPoliciesPut**](ProcessesAPI.md#SetProcessPoliciesApiV1ProcessesProcessIdPoliciesPut) | **Put** /api/v1/processes/{process_id}/policies | Set Process Policies
[**UpdateProcessApiV1ProcessesProcessIdPatch**](ProcessesAPI.md#UpdateProcessApiV1ProcessesProcessIdPatch) | **Patch** /api/v1/processes/{process_id} | Update Process



## CreateProcessApiV1ProcessesPost

> ProcessResponse CreateProcessApiV1ProcessesPost(ctx).ProcessCreateRequest(processCreateRequest).Execute()

Create Process

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
	processCreateRequest := *openapiclient.NewProcessCreateRequest("Name_example") // ProcessCreateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ProcessesAPI.CreateProcessApiV1ProcessesPost(context.Background()).ProcessCreateRequest(processCreateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProcessesAPI.CreateProcessApiV1ProcessesPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateProcessApiV1ProcessesPost`: ProcessResponse
	fmt.Fprintf(os.Stdout, "Response from `ProcessesAPI.CreateProcessApiV1ProcessesPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateProcessApiV1ProcessesPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **processCreateRequest** | [**ProcessCreateRequest**](ProcessCreateRequest.md) |  | 

### Return type

[**ProcessResponse**](ProcessResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeleteProcessApiV1ProcessesProcessIdDelete

> DeleteProcessApiV1ProcessesProcessIdDelete(ctx, processId).Execute()

Delete Process

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
	processId := "processId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.ProcessesAPI.DeleteProcessApiV1ProcessesProcessIdDelete(context.Background(), processId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProcessesAPI.DeleteProcessApiV1ProcessesProcessIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**processId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteProcessApiV1ProcessesProcessIdDeleteRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

 (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetProcessApiV1ProcessesProcessIdGet

> ProcessResponse GetProcessApiV1ProcessesProcessIdGet(ctx, processId).Execute()

Get Process

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
	processId := "processId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ProcessesAPI.GetProcessApiV1ProcessesProcessIdGet(context.Background(), processId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProcessesAPI.GetProcessApiV1ProcessesProcessIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetProcessApiV1ProcessesProcessIdGet`: ProcessResponse
	fmt.Fprintf(os.Stdout, "Response from `ProcessesAPI.GetProcessApiV1ProcessesProcessIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**processId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetProcessApiV1ProcessesProcessIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**ProcessResponse**](ProcessResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListProcessPoliciesApiV1ProcessesProcessIdPoliciesGet

> []*string ListProcessPoliciesApiV1ProcessesProcessIdPoliciesGet(ctx, processId).Execute()

List Process Policies

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
	processId := "processId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ProcessesAPI.ListProcessPoliciesApiV1ProcessesProcessIdPoliciesGet(context.Background(), processId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProcessesAPI.ListProcessPoliciesApiV1ProcessesProcessIdPoliciesGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListProcessPoliciesApiV1ProcessesProcessIdPoliciesGet`: []*string
	fmt.Fprintf(os.Stdout, "Response from `ProcessesAPI.ListProcessPoliciesApiV1ProcessesProcessIdPoliciesGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**processId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiListProcessPoliciesApiV1ProcessesProcessIdPoliciesGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

**[]*string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListProcessesApiV1ProcessesGet

> []ProcessResponse ListProcessesApiV1ProcessesGet(ctx).Status(status).Limit(limit).Offset(offset).Execute()

List Processes

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
	status := openapiclient.CatalogStatus("active") // CatalogStatus |  (optional)
	limit := int32(56) // int32 |  (optional) (default to 100)
	offset := int32(56) // int32 |  (optional) (default to 0)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ProcessesAPI.ListProcessesApiV1ProcessesGet(context.Background()).Status(status).Limit(limit).Offset(offset).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProcessesAPI.ListProcessesApiV1ProcessesGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListProcessesApiV1ProcessesGet`: []ProcessResponse
	fmt.Fprintf(os.Stdout, "Response from `ProcessesAPI.ListProcessesApiV1ProcessesGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListProcessesApiV1ProcessesGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | [**CatalogStatus**](CatalogStatus.md) |  | 
 **limit** | **int32** |  | [default to 100]
 **offset** | **int32** |  | [default to 0]

### Return type

[**[]ProcessResponse**](ProcessResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SetProcessPoliciesApiV1ProcessesProcessIdPoliciesPut

> []*string SetProcessPoliciesApiV1ProcessesProcessIdPoliciesPut(ctx, processId).PolicyIdsRequest(policyIdsRequest).Execute()

Set Process Policies

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
	processId := "processId_example" // string | 
	policyIdsRequest := *openapiclient.NewPolicyIdsRequest() // PolicyIdsRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ProcessesAPI.SetProcessPoliciesApiV1ProcessesProcessIdPoliciesPut(context.Background(), processId).PolicyIdsRequest(policyIdsRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProcessesAPI.SetProcessPoliciesApiV1ProcessesProcessIdPoliciesPut``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SetProcessPoliciesApiV1ProcessesProcessIdPoliciesPut`: []*string
	fmt.Fprintf(os.Stdout, "Response from `ProcessesAPI.SetProcessPoliciesApiV1ProcessesProcessIdPoliciesPut`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**processId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiSetProcessPoliciesApiV1ProcessesProcessIdPoliciesPutRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **policyIdsRequest** | [**PolicyIdsRequest**](PolicyIdsRequest.md) |  | 

### Return type

**[]*string**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UpdateProcessApiV1ProcessesProcessIdPatch

> ProcessResponse UpdateProcessApiV1ProcessesProcessIdPatch(ctx, processId).ProcessUpdateRequest(processUpdateRequest).Execute()

Update Process

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
	processId := "processId_example" // string | 
	processUpdateRequest := *openapiclient.NewProcessUpdateRequest() // ProcessUpdateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.ProcessesAPI.UpdateProcessApiV1ProcessesProcessIdPatch(context.Background(), processId).ProcessUpdateRequest(processUpdateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `ProcessesAPI.UpdateProcessApiV1ProcessesProcessIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateProcessApiV1ProcessesProcessIdPatch`: ProcessResponse
	fmt.Fprintf(os.Stdout, "Response from `ProcessesAPI.UpdateProcessApiV1ProcessesProcessIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**processId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateProcessApiV1ProcessesProcessIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **processUpdateRequest** | [**ProcessUpdateRequest**](ProcessUpdateRequest.md) |  | 

### Return type

[**ProcessResponse**](ProcessResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

