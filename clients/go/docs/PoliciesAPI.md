# \PoliciesAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ActivatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost**](PoliciesAPI.md#ActivatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost) | **Post** /api/v1/policies/{policy_id}/versions/{ver}/activate | Activate Policy Version
[**ChangePolicyStatusApiV1PoliciesPolicyIdStatusPost**](PoliciesAPI.md#ChangePolicyStatusApiV1PoliciesPolicyIdStatusPost) | **Post** /api/v1/policies/{policy_id}/status | Change Policy Status
[**CreatePolicyApiV1PoliciesPost**](PoliciesAPI.md#CreatePolicyApiV1PoliciesPost) | **Post** /api/v1/policies | Create Policy
[**DeletePolicyApiV1PoliciesPolicyIdDelete**](PoliciesAPI.md#DeletePolicyApiV1PoliciesPolicyIdDelete) | **Delete** /api/v1/policies/{policy_id} | Delete Policy
[**DiffPolicyVersionsApiV1PoliciesPolicyIdDiffPost**](PoliciesAPI.md#DiffPolicyVersionsApiV1PoliciesPolicyIdDiffPost) | **Post** /api/v1/policies/{policy_id}/diff | Diff Policy Versions
[**GetPolicyApiV1PoliciesPolicyIdGet**](PoliciesAPI.md#GetPolicyApiV1PoliciesPolicyIdGet) | **Get** /api/v1/policies/{policy_id} | Get Policy
[**GetPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet**](PoliciesAPI.md#GetPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet) | **Get** /api/v1/policies/{policy_id}/versions/{ver} | Get Policy Version
[**ImportPoliciesApiV1PoliciesImportPost**](PoliciesAPI.md#ImportPoliciesApiV1PoliciesImportPost) | **Post** /api/v1/policies/import | Import Policies
[**ListPoliciesApiV1PoliciesGet**](PoliciesAPI.md#ListPoliciesApiV1PoliciesGet) | **Get** /api/v1/policies | List Policies
[**ListPolicyVersionsApiV1PoliciesPolicyIdVersionsGet**](PoliciesAPI.md#ListPolicyVersionsApiV1PoliciesPolicyIdVersionsGet) | **Get** /api/v1/policies/{policy_id}/versions | List Policy Versions
[**UpdatePolicyApiV1PoliciesPolicyIdPut**](PoliciesAPI.md#UpdatePolicyApiV1PoliciesPolicyIdPut) | **Put** /api/v1/policies/{policy_id} | Update Policy
[**ValidatePolicyApiV1PoliciesValidatePost**](PoliciesAPI.md#ValidatePolicyApiV1PoliciesValidatePost) | **Post** /api/v1/policies/validate | Validate Policy



## ActivatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost

> interface{} ActivatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost(ctx, policyId, ver).Execute()

Activate Policy Version

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
	ver := int32(56) // int32 | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PoliciesAPI.ActivatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost(context.Background(), policyId, ver).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.ActivatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ActivatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost`: interface{}
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.ActivatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 
**ver** | **int32** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiActivatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------



### Return type

**interface{}**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ChangePolicyStatusApiV1PoliciesPolicyIdStatusPost

> interface{} ChangePolicyStatusApiV1PoliciesPolicyIdStatusPost(ctx, policyId).PolicyStatusChangeRequest(policyStatusChangeRequest).Execute()

Change Policy Status

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
	policyStatusChangeRequest := *openapiclient.NewPolicyStatusChangeRequest(openapiclient.PolicyStatus("draft")) // PolicyStatusChangeRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PoliciesAPI.ChangePolicyStatusApiV1PoliciesPolicyIdStatusPost(context.Background(), policyId).PolicyStatusChangeRequest(policyStatusChangeRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.ChangePolicyStatusApiV1PoliciesPolicyIdStatusPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ChangePolicyStatusApiV1PoliciesPolicyIdStatusPost`: interface{}
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.ChangePolicyStatusApiV1PoliciesPolicyIdStatusPost`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiChangePolicyStatusApiV1PoliciesPolicyIdStatusPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **policyStatusChangeRequest** | [**PolicyStatusChangeRequest**](PolicyStatusChangeRequest.md) |  | 

### Return type

**interface{}**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## CreatePolicyApiV1PoliciesPost

> interface{} CreatePolicyApiV1PoliciesPost(ctx).PolicyCreateRequest(policyCreateRequest).Execute()

Create Policy

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
	policyCreateRequest := *openapiclient.NewPolicyCreateRequest() // PolicyCreateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PoliciesAPI.CreatePolicyApiV1PoliciesPost(context.Background()).PolicyCreateRequest(policyCreateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.CreatePolicyApiV1PoliciesPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `CreatePolicyApiV1PoliciesPost`: interface{}
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.CreatePolicyApiV1PoliciesPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiCreatePolicyApiV1PoliciesPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **policyCreateRequest** | [**PolicyCreateRequest**](PolicyCreateRequest.md) |  | 

### Return type

**interface{}**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DeletePolicyApiV1PoliciesPolicyIdDelete

> interface{} DeletePolicyApiV1PoliciesPolicyIdDelete(ctx, policyId).Execute()

Delete Policy

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
	resp, r, err := apiClient.PoliciesAPI.DeletePolicyApiV1PoliciesPolicyIdDelete(context.Background(), policyId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.DeletePolicyApiV1PoliciesPolicyIdDelete``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `DeletePolicyApiV1PoliciesPolicyIdDelete`: interface{}
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.DeletePolicyApiV1PoliciesPolicyIdDelete`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiDeletePolicyApiV1PoliciesPolicyIdDeleteRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

**interface{}**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## DiffPolicyVersionsApiV1PoliciesPolicyIdDiffPost

> PolicyDiffResponse DiffPolicyVersionsApiV1PoliciesPolicyIdDiffPost(ctx, policyId).PolicyDiffRequest(policyDiffRequest).Execute()

Diff Policy Versions

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
	policyDiffRequest := *openapiclient.NewPolicyDiffRequest(int32(123), int32(123)) // PolicyDiffRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PoliciesAPI.DiffPolicyVersionsApiV1PoliciesPolicyIdDiffPost(context.Background(), policyId).PolicyDiffRequest(policyDiffRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.DiffPolicyVersionsApiV1PoliciesPolicyIdDiffPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `DiffPolicyVersionsApiV1PoliciesPolicyIdDiffPost`: PolicyDiffResponse
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.DiffPolicyVersionsApiV1PoliciesPolicyIdDiffPost`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiDiffPolicyVersionsApiV1PoliciesPolicyIdDiffPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **policyDiffRequest** | [**PolicyDiffRequest**](PolicyDiffRequest.md) |  | 

### Return type

[**PolicyDiffResponse**](PolicyDiffResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetPolicyApiV1PoliciesPolicyIdGet

> interface{} GetPolicyApiV1PoliciesPolicyIdGet(ctx, policyId).Execute()

Get Policy

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
	resp, r, err := apiClient.PoliciesAPI.GetPolicyApiV1PoliciesPolicyIdGet(context.Background(), policyId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.GetPolicyApiV1PoliciesPolicyIdGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetPolicyApiV1PoliciesPolicyIdGet`: interface{}
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.GetPolicyApiV1PoliciesPolicyIdGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetPolicyApiV1PoliciesPolicyIdGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

**interface{}**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## GetPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet

> interface{} GetPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet(ctx, policyId, ver).Execute()

Get Policy Version

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
	ver := int32(56) // int32 | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PoliciesAPI.GetPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet(context.Background(), policyId, ver).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.GetPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `GetPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet`: interface{}
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.GetPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 
**ver** | **int32** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiGetPolicyVersionApiV1PoliciesPolicyIdVersionsVerGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------



### Return type

**interface{}**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ImportPoliciesApiV1PoliciesImportPost

> ImportResponse ImportPoliciesApiV1PoliciesImportPost(ctx).ImportRequest(importRequest).Execute()

Import Policies

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
	importRequest := *openapiclient.NewImportRequest("Yaml_example") // ImportRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PoliciesAPI.ImportPoliciesApiV1PoliciesImportPost(context.Background()).ImportRequest(importRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.ImportPoliciesApiV1PoliciesImportPost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ImportPoliciesApiV1PoliciesImportPost`: ImportResponse
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.ImportPoliciesApiV1PoliciesImportPost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiImportPoliciesApiV1PoliciesImportPostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **importRequest** | [**ImportRequest**](ImportRequest.md) |  | 

### Return type

[**ImportResponse**](ImportResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListPoliciesApiV1PoliciesGet

> []PolicyListItem ListPoliciesApiV1PoliciesGet(ctx).StatusFilter(statusFilter).PolicyKind(policyKind).Execute()

List Policies

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
	statusFilter := "statusFilter_example" // string |  (optional)
	policyKind := openapiclient.PolicyKind("retention") // PolicyKind |  (optional)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PoliciesAPI.ListPoliciesApiV1PoliciesGet(context.Background()).StatusFilter(statusFilter).PolicyKind(policyKind).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.ListPoliciesApiV1PoliciesGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListPoliciesApiV1PoliciesGet`: []PolicyListItem
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.ListPoliciesApiV1PoliciesGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListPoliciesApiV1PoliciesGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **statusFilter** | **string** |  | 
 **policyKind** | [**PolicyKind**](PolicyKind.md) |  | 

### Return type

[**[]PolicyListItem**](PolicyListItem.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ListPolicyVersionsApiV1PoliciesPolicyIdVersionsGet

> []PolicyVersionInfo ListPolicyVersionsApiV1PoliciesPolicyIdVersionsGet(ctx, policyId).Execute()

List Policy Versions

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
	resp, r, err := apiClient.PoliciesAPI.ListPolicyVersionsApiV1PoliciesPolicyIdVersionsGet(context.Background(), policyId).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.ListPolicyVersionsApiV1PoliciesPolicyIdVersionsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListPolicyVersionsApiV1PoliciesPolicyIdVersionsGet`: []PolicyVersionInfo
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.ListPolicyVersionsApiV1PoliciesPolicyIdVersionsGet`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiListPolicyVersionsApiV1PoliciesPolicyIdVersionsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------


### Return type

[**[]PolicyVersionInfo**](PolicyVersionInfo.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## UpdatePolicyApiV1PoliciesPolicyIdPut

> interface{} UpdatePolicyApiV1PoliciesPolicyIdPut(ctx, policyId).PolicyCreateRequest(policyCreateRequest).Execute()

Update Policy

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
	policyCreateRequest := *openapiclient.NewPolicyCreateRequest() // PolicyCreateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PoliciesAPI.UpdatePolicyApiV1PoliciesPolicyIdPut(context.Background(), policyId).PolicyCreateRequest(policyCreateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.UpdatePolicyApiV1PoliciesPolicyIdPut``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `UpdatePolicyApiV1PoliciesPolicyIdPut`: interface{}
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.UpdatePolicyApiV1PoliciesPolicyIdPut`: %v\n", resp)
}
```

### Path Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
**ctx** | **context.Context** | context for authentication, logging, cancellation, deadlines, tracing, etc.
**policyId** | **string** |  | 

### Other Parameters

Other parameters are passed through a pointer to a apiUpdatePolicyApiV1PoliciesPolicyIdPutRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------

 **policyCreateRequest** | [**PolicyCreateRequest**](PolicyCreateRequest.md) |  | 

### Return type

**interface{}**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)


## ValidatePolicyApiV1PoliciesValidatePost

> ValidateResponse ValidatePolicyApiV1PoliciesValidatePost(ctx).ValidateRequest(validateRequest).Execute()

Validate Policy

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
	validateRequest := *openapiclient.NewValidateRequest() // ValidateRequest | 

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.PoliciesAPI.ValidatePolicyApiV1PoliciesValidatePost(context.Background()).ValidateRequest(validateRequest).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `PoliciesAPI.ValidatePolicyApiV1PoliciesValidatePost``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ValidatePolicyApiV1PoliciesValidatePost`: ValidateResponse
	fmt.Fprintf(os.Stdout, "Response from `PoliciesAPI.ValidatePolicyApiV1PoliciesValidatePost`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiValidatePolicyApiV1PoliciesValidatePostRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **validateRequest** | [**ValidateRequest**](ValidateRequest.md) |  | 

### Return type

[**ValidateResponse**](ValidateResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

