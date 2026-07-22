# \PrivacyAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**PrivacyMaskApiV1PrivacyMaskPost**](PrivacyAPI.md#PrivacyMaskApiV1PrivacyMaskPost) | **Post** /api/v1/privacy/mask | Privacy Mask
[**PrivacyStatusApiV1PrivacyStatusGet**](PrivacyAPI.md#PrivacyStatusApiV1PrivacyStatusGet) | **Get** /api/v1/privacy/status | Privacy Status
[**PrivacyUnmaskApiV1PrivacyUnmaskPost**](PrivacyAPI.md#PrivacyUnmaskApiV1PrivacyUnmaskPost) | **Post** /api/v1/privacy/unmask | Privacy Unmask



## PrivacyMaskApiV1PrivacyMaskPost

> MaskResponse PrivacyMaskApiV1PrivacyMaskPost(ctx).MaskRequest(maskRequest).Execute()

Privacy Mask

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
	maskRequest := *openapiclient.NewMaskRequest() // MaskRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PrivacyAPI.PrivacyMaskApiV1PrivacyMaskPost(context.Background()).MaskRequest(maskRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PrivacyAPI.PrivacyMaskApiV1PrivacyMaskPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PrivacyMaskApiV1PrivacyMaskPost`: MaskResponse
	fmt.Fprintf(os.Stdout, "Response from `PrivacyAPI.PrivacyMaskApiV1PrivacyMaskPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPrivacyMaskApiV1PrivacyMaskPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **maskRequest** | [**MaskRequest**](MaskRequest.md) |  | 

### Return type

[**MaskResponse**](MaskResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PrivacyStatusApiV1PrivacyStatusGet

> PrivacyStatusResponse PrivacyStatusApiV1PrivacyStatusGet(ctx).Execute()

Privacy Status

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
	resp, r, err := apiClient.PrivacyAPI.PrivacyStatusApiV1PrivacyStatusGet(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PrivacyAPI.PrivacyStatusApiV1PrivacyStatusGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PrivacyStatusApiV1PrivacyStatusGet`: PrivacyStatusResponse
	fmt.Fprintf(os.Stdout, "Response from `PrivacyAPI.PrivacyStatusApiV1PrivacyStatusGet`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiPrivacyStatusApiV1PrivacyStatusGetRequest struct via the builder pattern


### Return type

[**PrivacyStatusResponse**](PrivacyStatusResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## PrivacyUnmaskApiV1PrivacyUnmaskPost

> UnmaskResponse PrivacyUnmaskApiV1PrivacyUnmaskPost(ctx).UnmaskRequest(unmaskRequest).Execute()

Privacy Unmask

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
	unmaskRequest := *openapiclient.NewUnmaskRequest("Text_example", "MappingToken_example") // UnmaskRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PrivacyAPI.PrivacyUnmaskApiV1PrivacyUnmaskPost(context.Background()).UnmaskRequest(unmaskRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PrivacyAPI.PrivacyUnmaskApiV1PrivacyUnmaskPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `PrivacyUnmaskApiV1PrivacyUnmaskPost`: UnmaskResponse
	fmt.Fprintf(os.Stdout, "Response from `PrivacyAPI.PrivacyUnmaskApiV1PrivacyUnmaskPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiPrivacyUnmaskApiV1PrivacyUnmaskPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **unmaskRequest** | [**UnmaskRequest**](UnmaskRequest.md) |  | 

### Return type

[**UnmaskResponse**](UnmaskResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

