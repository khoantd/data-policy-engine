# \AuditAPI

All URIs are relative to *http://localhost:8000*

Method | HTTP request | Description
------------- | ------------- | -------------
[**ListAuditLogsApiV1AuditLogsGet**](AuditAPI.md#ListAuditLogsApiV1AuditLogsGet) | **Get** /api/v1/audit/logs | List Audit Logs



## ListAuditLogsApiV1AuditLogsGet

> []AuditEntry ListAuditLogsApiV1AuditLogsGet(ctx).PolicyId(policyId).RecordId(recordId).JobId(jobId).EventType(eventType).Requester(requester).Since(since).Until(until).Limit(limit).Offset(offset).Execute()

List Audit Logs

### Example

```go
package main

import (
	"context"
	"fmt"
	"os"
    "time"
	openapiclient "github.com/drpe/drpe/drpe"
)

func main() {
	policyId := "policyId_example" // string |  (optional)
	recordId := "recordId_example" // string |  (optional)
	jobId := "jobId_example" // string |  (optional)
	eventType := openapiclient.AuditEventType("evaluation") // AuditEventType |  (optional)
	requester := "requester_example" // string |  (optional)
	since := time.Now() // time.Time |  (optional)
	until := time.Now() // time.Time |  (optional)
	limit := int32(56) // int32 |  (optional) (default to 100)
	offset := int32(56) // int32 |  (optional) (default to 0)

	configuration := openapiclient.NewConfiguration()
	apiClient := openapiclient.NewAPIClient(configuration)
	resp, r, err := apiClient.AuditAPI.ListAuditLogsApiV1AuditLogsGet(context.Background()).PolicyId(policyId).RecordId(recordId).JobId(jobId).EventType(eventType).Requester(requester).Since(since).Until(until).Limit(limit).Offset(offset).Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error when calling `AuditAPI.ListAuditLogsApiV1AuditLogsGet``: %v\n", err)
		fmt.Fprintf(os.Stderr, "Full HTTP response: %v\n", r)
	}
	// response from `ListAuditLogsApiV1AuditLogsGet`: []AuditEntry
	fmt.Fprintf(os.Stdout, "Response from `AuditAPI.ListAuditLogsApiV1AuditLogsGet`: %v\n", resp)
}
```

### Path Parameters



### Other Parameters

Other parameters are passed through a pointer to a apiListAuditLogsApiV1AuditLogsGetRequest struct via the builder pattern


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **policyId** | **string** |  | 
 **recordId** | **string** |  | 
 **jobId** | **string** |  | 
 **eventType** | [**AuditEventType**](AuditEventType.md) |  | 
 **requester** | **string** |  | 
 **since** | **time.Time** |  | 
 **until** | **time.Time** |  | 
 **limit** | **int32** |  | [default to 100]
 **offset** | **int32** |  | [default to 0]

### Return type

[**[]AuditEntry**](AuditEntry.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints)
[[Back to Model list]](../README.md#documentation-for-models)
[[Back to README]](../README.md)

