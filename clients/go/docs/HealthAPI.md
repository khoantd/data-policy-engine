# \HealthAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**HealthApiV1HealthGet**](HealthAPI.md#HealthApiV1HealthGet) | **Get** /api/v1/health | Health
[**ReadyApiV1HealthReadyGet**](HealthAPI.md#ReadyApiV1HealthReadyGet) | **Get** /api/v1/health/ready | Ready



## HealthApiV1HealthGet

> HealthResponse HealthApiV1HealthGet(ctx).Execute()

Health

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
	resp, r, err := apiClient.HealthAPI.HealthApiV1HealthGet(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `HealthAPI.HealthApiV1HealthGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `HealthApiV1HealthGet`: HealthResponse
	fmt.Fprintf(os.Stdout, "Response from `HealthAPI.HealthApiV1HealthGet`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiHealthApiV1HealthGetRequest struct via the builder pattern


### Return type

[**HealthResponse**](HealthResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ReadyApiV1HealthReadyGet

> ReadyResponse ReadyApiV1HealthReadyGet(ctx).Execute()

Ready

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
	resp, r, err := apiClient.HealthAPI.ReadyApiV1HealthReadyGet(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `HealthAPI.ReadyApiV1HealthReadyGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ReadyApiV1HealthReadyGet`: ReadyResponse
	fmt.Fprintf(os.Stdout, "Response from `HealthAPI.ReadyApiV1HealthReadyGet`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiReadyApiV1HealthReadyGetRequest struct via the builder pattern


### Return type

[**ReadyResponse**](ReadyResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

