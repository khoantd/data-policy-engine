# DsarApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getRequestApiV1DsarRequestsRequestIdGet**](DsarApi.md#getRequestApiV1DsarRequestsRequestIdGet) | **GET** /api/v1/dsar/requests/{request_id} | Get Request |
| [**listRequestsApiV1DsarRequestsGet**](DsarApi.md#listRequestsApiV1DsarRequestsGet) | **GET** /api/v1/dsar/requests | List Requests |
| [**submitAccessApiV1DsarAccessPost**](DsarApi.md#submitAccessApiV1DsarAccessPost) | **POST** /api/v1/dsar/access | Submit Access |
| [**submitErasureApiV1DsarErasurePost**](DsarApi.md#submitErasureApiV1DsarErasurePost) | **POST** /api/v1/dsar/erasure | Submit Erasure |


<a id="getRequestApiV1DsarRequestsRequestIdGet"></a>
# **getRequestApiV1DsarRequestsRequestIdGet**
> DsarRequest getRequestApiV1DsarRequestsRequestIdGet(requestId)

Get Request

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.DsarApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    DsarApi apiInstance = new DsarApi(defaultClient);
    String requestId = "requestId_example"; // String | 
    try {
      DsarRequest result = apiInstance.getRequestApiV1DsarRequestsRequestIdGet(requestId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DsarApi#getRequestApiV1DsarRequestsRequestIdGet");
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
| **requestId** | **String**|  | |

### Return type

[**DsarRequest**](DsarRequest.md)

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

<a id="listRequestsApiV1DsarRequestsGet"></a>
# **listRequestsApiV1DsarRequestsGet**
> List&lt;DsarRequest&gt; listRequestsApiV1DsarRequestsGet(type, status, subjectId, policyId, limit, offset)

List Requests

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.DsarApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    DsarApi apiInstance = new DsarApi(defaultClient);
    DsarRequestType type = DsarRequestType.fromValue("access"); // DsarRequestType | 
    DsarRequestStatus status = DsarRequestStatus.fromValue("received"); // DsarRequestStatus | 
    String subjectId = "subjectId_example"; // String | 
    String policyId = "policyId_example"; // String | 
    Integer limit = 100; // Integer | 
    Integer offset = 0; // Integer | 
    try {
      List<DsarRequest> result = apiInstance.listRequestsApiV1DsarRequestsGet(type, status, subjectId, policyId, limit, offset);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DsarApi#listRequestsApiV1DsarRequestsGet");
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
| **type** | [**DsarRequestType**](.md)|  | [optional] [enum: access, erasure] |
| **status** | [**DsarRequestStatus**](.md)|  | [optional] [enum: received, in_progress, completed, partial, denied, failed] |
| **subjectId** | **String**|  | [optional] |
| **policyId** | **String**|  | [optional] |
| **limit** | **Integer**|  | [optional] [default to 100] |
| **offset** | **Integer**|  | [optional] [default to 0] |

### Return type

[**List&lt;DsarRequest&gt;**](DsarRequest.md)

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

<a id="submitAccessApiV1DsarAccessPost"></a>
# **submitAccessApiV1DsarAccessPost**
> DsarRequest submitAccessApiV1DsarAccessPost(dsarSubmitRequest)

Submit Access

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.DsarApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    DsarApi apiInstance = new DsarApi(defaultClient);
    DsarSubmitRequest dsarSubmitRequest = new DsarSubmitRequest(); // DsarSubmitRequest | 
    try {
      DsarRequest result = apiInstance.submitAccessApiV1DsarAccessPost(dsarSubmitRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DsarApi#submitAccessApiV1DsarAccessPost");
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
| **dsarSubmitRequest** | [**DsarSubmitRequest**](DsarSubmitRequest.md)|  | |

### Return type

[**DsarRequest**](DsarRequest.md)

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

<a id="submitErasureApiV1DsarErasurePost"></a>
# **submitErasureApiV1DsarErasurePost**
> DsarRequest submitErasureApiV1DsarErasurePost(dsarSubmitRequest)

Submit Erasure

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.DsarApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    DsarApi apiInstance = new DsarApi(defaultClient);
    DsarSubmitRequest dsarSubmitRequest = new DsarSubmitRequest(); // DsarSubmitRequest | 
    try {
      DsarRequest result = apiInstance.submitErasureApiV1DsarErasurePost(dsarSubmitRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling DsarApi#submitErasureApiV1DsarErasurePost");
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
| **dsarSubmitRequest** | [**DsarSubmitRequest**](DsarSubmitRequest.md)|  | |

### Return type

[**DsarRequest**](DsarRequest.md)

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

