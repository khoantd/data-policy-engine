# AuditApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**listAuditLogsApiV1AuditLogsGet**](AuditApi.md#listAuditLogsApiV1AuditLogsGet) | **GET** /api/v1/audit/logs | List Audit Logs |


<a id="listAuditLogsApiV1AuditLogsGet"></a>
# **listAuditLogsApiV1AuditLogsGet**
> List&lt;AuditEntry&gt; listAuditLogsApiV1AuditLogsGet(policyId, recordId, jobId, eventType, requester, since, until, limit, offset)

List Audit Logs

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.AuditApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    AuditApi apiInstance = new AuditApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    String recordId = "recordId_example"; // String | 
    String jobId = "jobId_example"; // String | 
    AuditEventType eventType = AuditEventType.fromValue("evaluation"); // AuditEventType | 
    String requester = "requester_example"; // String | 
    OffsetDateTime since = OffsetDateTime.now(); // OffsetDateTime | 
    OffsetDateTime until = OffsetDateTime.now(); // OffsetDateTime | 
    Integer limit = 100; // Integer | 
    Integer offset = 0; // Integer | 
    try {
      List<AuditEntry> result = apiInstance.listAuditLogsApiV1AuditLogsGet(policyId, recordId, jobId, eventType, requester, since, until, limit, offset);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling AuditApi#listAuditLogsApiV1AuditLogsGet");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters

| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **policyId** | **String**|  | [optional] |
| **recordId** | **String**|  | [optional] |
| **jobId** | **String**|  | [optional] |
| **eventType** | [**AuditEventType**](.md)|  | [optional] [enum: evaluation, action, notify, pending_grace, flag, dsar_access, dsar_erasure, grace_cancelled] |
| **requester** | **String**|  | [optional] |
| **since** | **OffsetDateTime**|  | [optional] |
| **until** | **OffsetDateTime**|  | [optional] |
| **limit** | **Integer**|  | [optional] [default to 100] |
| **offset** | **Integer**|  | [optional] [default to 0] |

### Return type

[**List&lt;AuditEntry&gt;**](AuditEntry.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

