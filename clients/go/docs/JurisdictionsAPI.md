# \JurisdictionsAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**GetOneApiV1JurisdictionsCodeGet**](JurisdictionsAPI.md#GetOneApiV1JurisdictionsCodeGet) | **Get** /api/v1/jurisdictions/{code} | Get One
[**ListAllApiV1JurisdictionsGet**](JurisdictionsAPI.md#ListAllApiV1JurisdictionsGet) | **Get** /api/v1/jurisdictions | List All



## GetOneApiV1JurisdictionsCodeGet

> map[string]interface{} GetOneApiV1JurisdictionsCodeGet(ctx, code).Execute()

Get One

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
	code := "code_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.JurisdictionsAPI.GetOneApiV1JurisdictionsCodeGet(context.Background(), code).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `JurisdictionsAPI.GetOneApiV1JurisdictionsCodeGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetOneApiV1JurisdictionsCodeGet`: map[string]interface{}
	fmt.Fprintf(os.Stdout, "Response from `JurisdictionsAPI.GetOneApiV1JurisdictionsCodeGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**code** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetOneApiV1JurisdictionsCodeGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

**map[string]interface{}**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListAllApiV1JurisdictionsGet

> []map[string]interface{} ListAllApiV1JurisdictionsGet(ctx).Execute()

List All

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

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.JurisdictionsAPI.ListAllApiV1JurisdictionsGet(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `JurisdictionsAPI.ListAllApiV1JurisdictionsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListAllApiV1JurisdictionsGet`: []map[string]interface{}
	fmt.Fprintf(os.Stdout, "Response from `JurisdictionsAPI.ListAllApiV1JurisdictionsGet`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiListAllApiV1JurisdictionsGetRequest struct via the builder pattern


### Return type

[**[]map[string]interface{}**](map.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

