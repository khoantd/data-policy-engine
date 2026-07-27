# \GuardrailsAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**CreateGuardrailPolicyApiV1GuardrailsPoliciesPost**](GuardrailsAPI.md#CreateGuardrailPolicyApiV1GuardrailsPoliciesPost) | **Post** /api/v1/guardrails/policies | Create Guardrail Policy
[**DeleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete**](GuardrailsAPI.md#DeleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete) | **Delete** /api/v1/guardrails/policies/{policy_id} | Delete Guardrail Policy
[**EvaluateGuardEventApiV1GuardrailsEvaluatePost**](GuardrailsAPI.md#EvaluateGuardEventApiV1GuardrailsEvaluatePost) | **Post** /api/v1/guardrails/evaluate | Evaluate Guard Event
[**GetGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet**](GuardrailsAPI.md#GetGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet) | **Get** /api/v1/guardrails/policies/{policy_id} | Get Guardrail Policy
[**GuardrailsStatusApiV1GuardrailsStatusGet**](GuardrailsAPI.md#GuardrailsStatusApiV1GuardrailsStatusGet) | **Get** /api/v1/guardrails/status | Guardrails Status
[**ListGuardrailPoliciesApiV1GuardrailsPoliciesGet**](GuardrailsAPI.md#ListGuardrailPoliciesApiV1GuardrailsPoliciesGet) | **Get** /api/v1/guardrails/policies | List Guardrail Policies
[**UpdateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut**](GuardrailsAPI.md#UpdateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut) | **Put** /api/v1/guardrails/policies/{policy_id} | Update Guardrail Policy



## CreateGuardrailPolicyApiV1GuardrailsPoliciesPost

> GuardrailPolicyResponse CreateGuardrailPolicyApiV1GuardrailsPoliciesPost(ctx).GuardrailPolicyCreateRequest(guardrailPolicyCreateRequest).Execute()

Create Guardrail Policy

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
	guardrailPolicyCreateRequest := *openapiclient.NewGuardrailPolicyCreateRequest("Name_example", map[string]interface{}{"key": interface{}(123)}) // GuardrailPolicyCreateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.GuardrailsAPI.CreateGuardrailPolicyApiV1GuardrailsPoliciesPost(context.Background()).GuardrailPolicyCreateRequest(guardrailPolicyCreateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GuardrailsAPI.CreateGuardrailPolicyApiV1GuardrailsPoliciesPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreateGuardrailPolicyApiV1GuardrailsPoliciesPost`: GuardrailPolicyResponse
	fmt.Fprintf(os.Stdout, "Response from `GuardrailsAPI.CreateGuardrailPolicyApiV1GuardrailsPoliciesPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreateGuardrailPolicyApiV1GuardrailsPoliciesPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **guardrailPolicyCreateRequest** | [**GuardrailPolicyCreateRequest**](GuardrailPolicyCreateRequest.md) |  | 

### Return type

[**GuardrailPolicyResponse**](GuardrailPolicyResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete

> DeleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete(ctx, policyId).Execute()

Delete Guardrail Policy

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
	policyId := "policyId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	r, err := apiClient.GuardrailsAPI.DeleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete(context.Background(), policyId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GuardrailsAPI.DeleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDeleteRequest struct via the builder pattern


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


## EvaluateGuardEventApiV1GuardrailsEvaluatePost

> VerdictResponse EvaluateGuardEventApiV1GuardrailsEvaluatePost(ctx).EvaluateRequest(evaluateRequest).Execute()

Evaluate Guard Event

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
	evaluateRequest := *openapiclient.NewEvaluateRequest(*openapiclient.NewGuardEventModel("Kind_example", "ObservationPoint_example", "EventId_example", "GuardId_example", "Timestamp_example")) // EvaluateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.GuardrailsAPI.EvaluateGuardEventApiV1GuardrailsEvaluatePost(context.Background()).EvaluateRequest(evaluateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GuardrailsAPI.EvaluateGuardEventApiV1GuardrailsEvaluatePost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `EvaluateGuardEventApiV1GuardrailsEvaluatePost`: VerdictResponse
	fmt.Fprintf(os.Stdout, "Response from `GuardrailsAPI.EvaluateGuardEventApiV1GuardrailsEvaluatePost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiEvaluateGuardEventApiV1GuardrailsEvaluatePostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **evaluateRequest** | [**EvaluateRequest**](EvaluateRequest.md) |  | 

### Return type

[**VerdictResponse**](VerdictResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet

> GuardrailPolicyResponse GetGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet(ctx, policyId).Execute()

Get Guardrail Policy

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
	policyId := "policyId_example" // string | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.GuardrailsAPI.GetGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet(context.Background(), policyId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GuardrailsAPI.GetGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet`: GuardrailPolicyResponse
	fmt.Fprintf(os.Stdout, "Response from `GuardrailsAPI.GetGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**GuardrailPolicyResponse**](GuardrailPolicyResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GuardrailsStatusApiV1GuardrailsStatusGet

> GuardrailsStatusResponse GuardrailsStatusApiV1GuardrailsStatusGet(ctx).Execute()

Guardrails Status

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
	resp, r, err := apiClient.GuardrailsAPI.GuardrailsStatusApiV1GuardrailsStatusGet(context.Background()).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GuardrailsAPI.GuardrailsStatusApiV1GuardrailsStatusGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GuardrailsStatusApiV1GuardrailsStatusGet`: GuardrailsStatusResponse
	fmt.Fprintf(os.Stdout, "Response from `GuardrailsAPI.GuardrailsStatusApiV1GuardrailsStatusGet`: %v\n", resp)
}
```

### Path Parameters

This endpoint does not need any parameter.

### Other Parameters

Other parameters are passed through a pointer to a apiGuardrailsStatusApiV1GuardrailsStatusGetRequest struct via the builder pattern


### Return type

[**GuardrailsStatusResponse**](GuardrailsStatusResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListGuardrailPoliciesApiV1GuardrailsPoliciesGet

> []GuardrailPolicyResponse ListGuardrailPoliciesApiV1GuardrailsPoliciesGet(ctx).Limit(limit).Offset(offset).Execute()

List Guardrail Policies

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
	limit := int32(56) // int32 |  (optional) (default to 100)
	offset := int32(56) // int32 |  (optional) (default to 0)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.GuardrailsAPI.ListGuardrailPoliciesApiV1GuardrailsPoliciesGet(context.Background()).Limit(limit).Offset(offset).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GuardrailsAPI.ListGuardrailPoliciesApiV1GuardrailsPoliciesGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListGuardrailPoliciesApiV1GuardrailsPoliciesGet`: []GuardrailPolicyResponse
	fmt.Fprintf(os.Stdout, "Response from `GuardrailsAPI.ListGuardrailPoliciesApiV1GuardrailsPoliciesGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListGuardrailPoliciesApiV1GuardrailsPoliciesGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **int32** |  | [default to 100]
 **offset** | **int32** |  | [default to 0]

### Return type

[**[]GuardrailPolicyResponse**](GuardrailPolicyResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UpdateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut

> GuardrailPolicyResponse UpdateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut(ctx, policyId).GuardrailPolicyUpdateRequest(guardrailPolicyUpdateRequest).Execute()

Update Guardrail Policy

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
	policyId := "policyId_example" // string | 
	guardrailPolicyUpdateRequest := *openapiclient.NewGuardrailPolicyUpdateRequest() // GuardrailPolicyUpdateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.GuardrailsAPI.UpdateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut(context.Background(), policyId).GuardrailPolicyUpdateRequest(guardrailPolicyUpdateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `GuardrailsAPI.UpdateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut`: GuardrailPolicyResponse
	fmt.Fprintf(os.Stdout, "Response from `GuardrailsAPI.UpdateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPutRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **guardrailPolicyUpdateRequest** | [**GuardrailPolicyUpdateRequest**](GuardrailPolicyUpdateRequest.md) |  | 

### Return type

[**GuardrailPolicyResponse**](GuardrailPolicyResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

