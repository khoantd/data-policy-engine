# ProcessesApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createProcessApiV1ProcessesPost**](ProcessesApi.md#createProcessApiV1ProcessesPost) | **POST** /api/v1/processes | Create Process |
| [**deleteProcessApiV1ProcessesProcessIdDelete**](ProcessesApi.md#deleteProcessApiV1ProcessesProcessIdDelete) | **DELETE** /api/v1/processes/{process_id} | Delete Process |
| [**getProcessApiV1ProcessesProcessIdGet**](ProcessesApi.md#getProcessApiV1ProcessesProcessIdGet) | **GET** /api/v1/processes/{process_id} | Get Process |
| [**listProcessPoliciesApiV1ProcessesProcessIdPoliciesGet**](ProcessesApi.md#listProcessPoliciesApiV1ProcessesProcessIdPoliciesGet) | **GET** /api/v1/processes/{process_id}/policies | List Process Policies |
| [**listProcessesApiV1ProcessesGet**](ProcessesApi.md#listProcessesApiV1ProcessesGet) | **GET** /api/v1/processes | List Processes |
| [**setProcessPoliciesApiV1ProcessesProcessIdPoliciesPut**](ProcessesApi.md#setProcessPoliciesApiV1ProcessesProcessIdPoliciesPut) | **PUT** /api/v1/processes/{process_id}/policies | Set Process Policies |
| [**updateProcessApiV1ProcessesProcessIdPatch**](ProcessesApi.md#updateProcessApiV1ProcessesProcessIdPatch) | **PATCH** /api/v1/processes/{process_id} | Update Process |


<a id="createProcessApiV1ProcessesPost"></a>
# **createProcessApiV1ProcessesPost**
> ProcessResponse createProcessApiV1ProcessesPost(processCreateRequest)

Create Process

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.ProcessesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    ProcessesApi apiInstance = new ProcessesApi(defaultClient);
    ProcessCreateRequest processCreateRequest = new ProcessCreateRequest(); // ProcessCreateRequest | 
    try {
      ProcessResponse result = apiInstance.createProcessApiV1ProcessesPost(processCreateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ProcessesApi#createProcessApiV1ProcessesPost");
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
| **processCreateRequest** | [**ProcessCreateRequest**](ProcessCreateRequest.md)|  | |

### Return type

[**ProcessResponse**](ProcessResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful Response |  -  |
| **422** | Validation Error |  -  |

<a id="deleteProcessApiV1ProcessesProcessIdDelete"></a>
# **deleteProcessApiV1ProcessesProcessIdDelete**
> deleteProcessApiV1ProcessesProcessIdDelete(processId)

Delete Process

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.ProcessesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    ProcessesApi apiInstance = new ProcessesApi(defaultClient);
    String processId = "processId_example"; // String | 
    try {
      apiInstance.deleteProcessApiV1ProcessesProcessIdDelete(processId);
    } catch (ApiException e) {
      System.err.println("Exception when calling ProcessesApi#deleteProcessApiV1ProcessesProcessIdDelete");
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
| **processId** | **String**|  | |

### Return type

null (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful Response |  -  |
| **422** | Validation Error |  -  |

<a id="getProcessApiV1ProcessesProcessIdGet"></a>
# **getProcessApiV1ProcessesProcessIdGet**
> ProcessResponse getProcessApiV1ProcessesProcessIdGet(processId)

Get Process

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.ProcessesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    ProcessesApi apiInstance = new ProcessesApi(defaultClient);
    String processId = "processId_example"; // String | 
    try {
      ProcessResponse result = apiInstance.getProcessApiV1ProcessesProcessIdGet(processId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ProcessesApi#getProcessApiV1ProcessesProcessIdGet");
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
| **processId** | **String**|  | |

### Return type

[**ProcessResponse**](ProcessResponse.md)

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

<a id="listProcessPoliciesApiV1ProcessesProcessIdPoliciesGet"></a>
# **listProcessPoliciesApiV1ProcessesProcessIdPoliciesGet**
> List&lt;String&gt; listProcessPoliciesApiV1ProcessesProcessIdPoliciesGet(processId)

List Process Policies

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.ProcessesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    ProcessesApi apiInstance = new ProcessesApi(defaultClient);
    String processId = "processId_example"; // String | 
    try {
      List<String> result = apiInstance.listProcessPoliciesApiV1ProcessesProcessIdPoliciesGet(processId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ProcessesApi#listProcessPoliciesApiV1ProcessesProcessIdPoliciesGet");
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
| **processId** | **String**|  | |

### Return type

**List&lt;String&gt;**

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

<a id="listProcessesApiV1ProcessesGet"></a>
# **listProcessesApiV1ProcessesGet**
> List&lt;ProcessResponse&gt; listProcessesApiV1ProcessesGet(status, limit, offset)

List Processes

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.ProcessesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    ProcessesApi apiInstance = new ProcessesApi(defaultClient);
    CatalogStatus status = CatalogStatus.fromValue("active"); // CatalogStatus | 
    Integer limit = 100; // Integer | 
    Integer offset = 0; // Integer | 
    try {
      List<ProcessResponse> result = apiInstance.listProcessesApiV1ProcessesGet(status, limit, offset);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ProcessesApi#listProcessesApiV1ProcessesGet");
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
| **status** | [**CatalogStatus**](.md)|  | [optional] [enum: active, retired] |
| **limit** | **Integer**|  | [optional] [default to 100] |
| **offset** | **Integer**|  | [optional] [default to 0] |

### Return type

[**List&lt;ProcessResponse&gt;**](ProcessResponse.md)

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

<a id="setProcessPoliciesApiV1ProcessesProcessIdPoliciesPut"></a>
# **setProcessPoliciesApiV1ProcessesProcessIdPoliciesPut**
> List&lt;String&gt; setProcessPoliciesApiV1ProcessesProcessIdPoliciesPut(processId, policyIdsRequest)

Set Process Policies

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.ProcessesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    ProcessesApi apiInstance = new ProcessesApi(defaultClient);
    String processId = "processId_example"; // String | 
    PolicyIdsRequest policyIdsRequest = new PolicyIdsRequest(); // PolicyIdsRequest | 
    try {
      List<String> result = apiInstance.setProcessPoliciesApiV1ProcessesProcessIdPoliciesPut(processId, policyIdsRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ProcessesApi#setProcessPoliciesApiV1ProcessesProcessIdPoliciesPut");
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
| **processId** | **String**|  | |
| **policyIdsRequest** | [**PolicyIdsRequest**](PolicyIdsRequest.md)|  | |

### Return type

**List&lt;String&gt;**

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

<a id="updateProcessApiV1ProcessesProcessIdPatch"></a>
# **updateProcessApiV1ProcessesProcessIdPatch**
> ProcessResponse updateProcessApiV1ProcessesProcessIdPatch(processId, processUpdateRequest)

Update Process

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.ProcessesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    ProcessesApi apiInstance = new ProcessesApi(defaultClient);
    String processId = "processId_example"; // String | 
    ProcessUpdateRequest processUpdateRequest = new ProcessUpdateRequest(); // ProcessUpdateRequest | 
    try {
      ProcessResponse result = apiInstance.updateProcessApiV1ProcessesProcessIdPatch(processId, processUpdateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ProcessesApi#updateProcessApiV1ProcessesProcessIdPatch");
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
| **processId** | **String**|  | |
| **processUpdateRequest** | [**ProcessUpdateRequest**](ProcessUpdateRequest.md)|  | |

### Return type

[**ProcessResponse**](ProcessResponse.md)

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

