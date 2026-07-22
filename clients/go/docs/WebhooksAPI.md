# \WebhooksAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateWebhookApiV1WebhooksPost**](WebhooksAPI.md#CreateWebhookApiV1WebhooksPost) | **Post** /api/v1/webhooks | Create Webhook
[**DeleteWebhookApiV1WebhooksWebhookIdDelete**](WebhooksAPI.md#DeleteWebhookApiV1WebhooksWebhookIdDelete) | **Delete** /api/v1/webhooks/{webhook_id} | Delete Webhook
[**GetWebhookApiV1WebhooksWebhookIdGet**](WebhooksAPI.md#GetWebhookApiV1WebhooksWebhookIdGet) | **Get** /api/v1/webhooks/{webhook_id} | Get Webhook
[**ListWebhooksApiV1WebhooksGet**](WebhooksAPI.md#ListWebhooksApiV1WebhooksGet) | **Get** /api/v1/webhooks | List Webhooks
[**UpdateWebhookApiV1WebhooksWebhookIdPatch**](WebhooksAPI.md#UpdateWebhookApiV1WebhooksWebhookIdPatch) | **Patch** /api/v1/webhooks/{webhook_id} | Update Webhook



## CreateWebhookApiV1WebhooksPost

> WebhookCreateResponse CreateWebhookApiV1WebhooksPost(ctx).WebhookCreateRequest(webhookCreateRequest).Execute()

Create Webhook

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
	webhookCreateRequest := *openapiclient.NewWebhookCreateRequest("Url_example", []string{"Events_example"}) // WebhookCreateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhooksAPI.CreateWebhookApiV1WebhooksPost(context.Background()).WebhookCreateRequest(webhookCreateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhooksAPI.CreateWebhookApiV1WebhooksPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateWebhookApiV1WebhooksPost`: WebhookCreateResponse
	fmt.Fprintf(os.Stdout, "Response from `WebhooksAPI.CreateWebhookApiV1WebhooksPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateWebhookApiV1WebhooksPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **webhookCreateRequest** | [**WebhookCreateRequest**](WebhookCreateRequest.md) |  | 

### Return type

[**WebhookCreateResponse**](WebhookCreateResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeleteWebhookApiV1WebhooksWebhookIdDelete

> DeleteWebhookApiV1WebhooksWebhookIdDelete(ctx, webhookId).Execute()

Delete Webhook

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
	webhookId := "webhookId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.WebhooksAPI.DeleteWebhookApiV1WebhooksWebhookIdDelete(context.Background(), webhookId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhooksAPI.DeleteWebhookApiV1WebhooksWebhookIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**webhookId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteWebhookApiV1WebhooksWebhookIdDeleteRequest struct via the builder pattern


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


## GetWebhookApiV1WebhooksWebhookIdGet

> WebhookResponse GetWebhookApiV1WebhooksWebhookIdGet(ctx, webhookId).Execute()

Get Webhook

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
	webhookId := "webhookId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhooksAPI.GetWebhookApiV1WebhooksWebhookIdGet(context.Background(), webhookId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhooksAPI.GetWebhookApiV1WebhooksWebhookIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetWebhookApiV1WebhooksWebhookIdGet`: WebhookResponse
	fmt.Fprintf(os.Stdout, "Response from `WebhooksAPI.GetWebhookApiV1WebhooksWebhookIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**webhookId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetWebhookApiV1WebhooksWebhookIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**WebhookResponse**](WebhookResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListWebhooksApiV1WebhooksGet

> []WebhookResponse ListWebhooksApiV1WebhooksGet(ctx).Active(active).Limit(limit).Offset(offset).Execute()

List Webhooks

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
	active := true // bool |  (optional)
	limit := int32(56) // int32 |  (optional) (default to 100)
	offset := int32(56) // int32 |  (optional) (default to 0)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhooksAPI.ListWebhooksApiV1WebhooksGet(context.Background()).Active(active).Limit(limit).Offset(offset).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhooksAPI.ListWebhooksApiV1WebhooksGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListWebhooksApiV1WebhooksGet`: []WebhookResponse
	fmt.Fprintf(os.Stdout, "Response from `WebhooksAPI.ListWebhooksApiV1WebhooksGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListWebhooksApiV1WebhooksGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **active** | **bool** |  | 
 **limit** | **int32** |  | [default to 100]
 **offset** | **int32** |  | [default to 0]

### Return type

[**[]WebhookResponse**](WebhookResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UpdateWebhookApiV1WebhooksWebhookIdPatch

> WebhookResponse UpdateWebhookApiV1WebhooksWebhookIdPatch(ctx, webhookId).WebhookUpdateRequest(webhookUpdateRequest).Execute()

Update Webhook

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
	webhookId := "webhookId_example" // string | 
	webhookUpdateRequest := *openapiclient.NewWebhookUpdateRequest() // WebhookUpdateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.WebhooksAPI.UpdateWebhookApiV1WebhooksWebhookIdPatch(context.Background(), webhookId).WebhookUpdateRequest(webhookUpdateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `WebhooksAPI.UpdateWebhookApiV1WebhooksWebhookIdPatch``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateWebhookApiV1WebhooksWebhookIdPatch`: WebhookResponse
	fmt.Fprintf(os.Stdout, "Response from `WebhooksAPI.UpdateWebhookApiV1WebhooksWebhookIdPatch`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**webhookId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateWebhookApiV1WebhooksWebhookIdPatchRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **webhookUpdateRequest** | [**WebhookUpdateRequest**](WebhookUpdateRequest.md) |  | 

### Return type

[**WebhookResponse**](WebhookResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

