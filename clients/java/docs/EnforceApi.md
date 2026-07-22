# EnforceApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getJobApiV1EnforceJobsJobIdGet**](EnforceApi.md#getJobApiV1EnforceJobsJobIdGet) | **GET** /api/v1/enforce/jobs/{job_id} | Get Job |
| [**listJobsApiV1EnforceJobsGet**](EnforceApi.md#listJobsApiV1EnforceJobsGet) | **GET** /api/v1/enforce/jobs | List Jobs |
| [**triggerEnforceApiV1EnforcePost**](EnforceApi.md#triggerEnforceApiV1EnforcePost) | **POST** /api/v1/enforce | Trigger Enforce |


<a id="getJobApiV1EnforceJobsJobIdGet"></a>
# **getJobApiV1EnforceJobsJobIdGet**
> EnforcementJob getJobApiV1EnforceJobsJobIdGet(jobId)

Get Job

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.EnforceApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    EnforceApi apiInstance = new EnforceApi(defaultClient);
    String jobId = "jobId_example"; // String | 
    try {
      EnforcementJob result = apiInstance.getJobApiV1EnforceJobsJobIdGet(jobId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EnforceApi#getJobApiV1EnforceJobsJobIdGet");
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
| **jobId** | **String**|  | |

### Return type

[**EnforcementJob**](EnforcementJob.md)

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

<a id="listJobsApiV1EnforceJobsGet"></a>
# **listJobsApiV1EnforceJobsGet**
> List&lt;EnforcementJob&gt; listJobsApiV1EnforceJobsGet(status, policyId, limit, offset)

List Jobs

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.EnforceApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    EnforceApi apiInstance = new EnforceApi(defaultClient);
    JobStatus status = JobStatus.fromValue("queued"); // JobStatus | 
    String policyId = "policyId_example"; // String | 
    Integer limit = 100; // Integer | 
    Integer offset = 0; // Integer | 
    try {
      List<EnforcementJob> result = apiInstance.listJobsApiV1EnforceJobsGet(status, policyId, limit, offset);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EnforceApi#listJobsApiV1EnforceJobsGet");
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
| **status** | [**JobStatus**](.md)|  | [optional] [enum: queued, running, succeeded, failed, cancelled] |
| **policyId** | **String**|  | [optional] |
| **limit** | **Integer**|  | [optional] [default to 100] |
| **offset** | **Integer**|  | [optional] [default to 0] |

### Return type

[**List&lt;EnforcementJob&gt;**](EnforcementJob.md)

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

<a id="triggerEnforceApiV1EnforcePost"></a>
# **triggerEnforceApiV1EnforcePost**
> EnforceResponse triggerEnforceApiV1EnforcePost(enforceRequest)

Trigger Enforce

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.EnforceApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    EnforceApi apiInstance = new EnforceApi(defaultClient);
    EnforceRequest enforceRequest = new EnforceRequest(); // EnforceRequest | 
    try {
      EnforceResponse result = apiInstance.triggerEnforceApiV1EnforcePost(enforceRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EnforceApi#triggerEnforceApiV1EnforcePost");
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
| **enforceRequest** | [**EnforceRequest**](EnforceRequest.md)|  | |

### Return type

[**EnforceResponse**](EnforceResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

