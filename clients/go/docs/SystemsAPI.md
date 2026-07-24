# \SystemsAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateSystemApiV1SystemsPost**](SystemsAPI.md#CreateSystemApiV1SystemsPost) | **Post** /api/v1/systems | Create System
[**DeleteSystemApiV1SystemsSystemIdDelete**](SystemsAPI.md#DeleteSystemApiV1SystemsSystemIdDelete) | **Delete** /api/v1/systems/{system_id} | Delete System
[**GetSystemApiV1SystemsSystemIdGet**](SystemsAPI.md#GetSystemApiV1SystemsSystemIdGet) | **Get** /api/v1/systems/{system_id} | Get System
[**ListSystemPoliciesApiV1SystemsSystemIdPoliciesGet**](SystemsAPI.md#ListSystemPoliciesApiV1SystemsSystemIdPoliciesGet) | **Get** /api/v1/systems/{system_id}/policies | List System Policies
[**ListSystemsApiV1SystemsGet**](SystemsAPI.md#ListSystemsApiV1SystemsGet) | **Get** /api/v1/systems | List Systems
[**SetSystemPoliciesApiV1SystemsSystemIdPoliciesPut**](SystemsAPI.md#SetSystemPoliciesApiV1SystemsSystemIdPoliciesPut) | **Put** /api/v1/systems/{system_id}/policies | Set System Policies
[**UpdateSystemApiV1SystemsSystemIdPatch**](SystemsAPI.md#UpdateSystemApiV1SystemsSystemIdPatch) | **Patch** /api/v1/systems/{system_id} | Update System



## CreateSystemApiV1SystemsPost

> SystemResponse CreateSystemApiV1SystemsPost(ctx).SystemCreateRequest(systemCreateRequest).Execute()

Create System

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
	systemCreateRequest := *openapiclient.NewSystemCreateRequest("Name_example") // SystemCreateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SystemsAPI.CreateSystemApiV1SystemsPost(context.Background()).SystemCreateRequest(systemCreateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SystemsAPI.CreateSystemApiV1SystemsPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateSystemApiV1SystemsPost`: SystemResponse
	fmt.Fprintf(os.Stdout, "Response from `SystemsAPI.CreateSystemApiV1SystemsPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateSystemApiV1SystemsPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **systemCreateRequest** | [**SystemCreateRequest**](SystemCreateRequest.md) |  | 

### Return type

[**SystemResponse**](SystemResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeleteSystemApiV1SystemsSystemIdDelete

> DeleteSystemApiV1SystemsSystemIdDelete(ctx, systemId).Execute()

Delete System

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
	systemId := "systemId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.SystemsAPI.DeleteSystemApiV1SystemsSystemIdDelete(context.Background(), systemId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SystemsAPI.DeleteSystemApiV1SystemsSystemIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**systemId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteSystemApiV1SystemsSystemIdDeleteRequest struct via the builder pattern


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


## GetSystemApiV1SystemsSystemIdGet

> SystemResponse GetSystemApiV1SystemsSystemIdGet(ctx, systemId).Execute()

Get System

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
	systemId := "systemId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SystemsAPI.GetSystemApiV1SystemsSystemIdGet(context.Background(), systemId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SystemsAPI.GetSystemApiV1SystemsSystemIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetSystemApiV1SystemsSystemIdGet`: SystemResponse
	fmt.Fprintf(os.Stdout, "Response from `SystemsAPI.GetSystemApiV1SystemsSystemIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**systemId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetSystemApiV1SystemsSystemIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**SystemResponse**](SystemResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListSystemPoliciesApiV1SystemsSystemIdPoliciesGet

> []*string ListSystemPoliciesApiV1SystemsSystemIdPoliciesGet(ctx, systemId).Execute()

List System Policies

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
	systemId := "systemId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SystemsAPI.ListSystemPoliciesApiV1SystemsSystemIdPoliciesGet(context.Background(), systemId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SystemsAPI.ListSystemPoliciesApiV1SystemsSystemIdPoliciesGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListSystemPoliciesApiV1SystemsSystemIdPoliciesGet`: []*string
	fmt.Fprintf(os.Stdout, "Response from `SystemsAPI.ListSystemPoliciesApiV1SystemsSystemIdPoliciesGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**systemId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiListSystemPoliciesApiV1SystemsSystemIdPoliciesGetRequest struct via the builder pattern


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


## ListSystemsApiV1SystemsGet

> []SystemResponse ListSystemsApiV1SystemsGet(ctx).Status(status).Limit(limit).Offset(offset).Execute()

List Systems

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
	resp, r, err := apiClient.SystemsAPI.ListSystemsApiV1SystemsGet(context.Background()).Status(status).Limit(limit).Offset(offset).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SystemsAPI.ListSystemsApiV1SystemsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListSystemsApiV1SystemsGet`: []SystemResponse
	fmt.Fprintf(os.Stdout, "Response from `SystemsAPI.ListSystemsApiV1SystemsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListSystemsApiV1SystemsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **status** | [**CatalogStatus**](CatalogStatus.md) |  | 
 **limit** | **int32** |  | [default to 100]
 **offset** | **int32** |  | [default to 0]

### Return type

[**[]SystemResponse**](SystemResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## SetSystemPoliciesApiV1SystemsSystemIdPoliciesPut

> []*string SetSystemPoliciesApiV1SystemsSystemIdPoliciesPut(ctx, systemId).PolicyIdsRequest(policyIdsRequest).Execute()

Set System Policies

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
	systemId := "systemId_example" // string | 
	policyIdsRequest := *openapiclient.NewPolicyIdsRequest() // PolicyIdsRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SystemsAPI.SetSystemPoliciesApiV1SystemsSystemIdPoliciesPut(context.Background(), systemId).PolicyIdsRequest(policyIdsRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SystemsAPI.SetSystemPoliciesApiV1SystemsSystemIdPoliciesPut``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `SetSystemPoliciesApiV1SystemsSystemIdPoliciesPut`: []*string
	fmt.Fprintf(os.Stdout, "Response from `SystemsAPI.SetSystemPoliciesApiV1SystemsSystemIdPoliciesPut`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**systemId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiSetSystemPoliciesApiV1SystemsSystemIdPoliciesPutRequest struct via the builder pattern


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


## UpdateSystemApiV1SystemsSystemIdPatch

> SystemResponse UpdateSystemApiV1SystemsSystemIdPatch(ctx, systemId).SystemUpdateRequest(systemUpdateRequest).Execute()

Update System

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
	systemId := "systemId_example" // string | 
	systemUpdateRequest := *openapiclient.NewSystemUpdateRequest() // SystemUpdateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.SystemsAPI.UpdateSystemApiV1SystemsSystemIdPatch(context.Background(), systemId).SystemUpdateRequest(systemUpdateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `SystemsAPI.UpdateSystemApiV1SystemsSystemIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateSystemApiV1SystemsSystemIdPatch`: SystemResponse
	fmt.Fprintf(os.Stdout, "Response from `SystemsAPI.UpdateSystemApiV1SystemsSystemIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**systemId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateSystemApiV1SystemsSystemIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **systemUpdateRequest** | [**SystemUpdateRequest**](SystemUpdateRequest.md) |  | 

### Return type

[**SystemResponse**](SystemResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

