# GraceHoldsApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**cancelGraceHoldApiV1GraceHoldsHoldIdCancelPost**](GraceHoldsApi.md#cancelGraceHoldApiV1GraceHoldsHoldIdCancelPost) | **POST** /api/v1/grace-holds/{hold_id}/cancel | Cancel Grace Hold |
| [**forceGraceHoldApiV1GraceHoldsHoldIdForcePost**](GraceHoldsApi.md#forceGraceHoldApiV1GraceHoldsHoldIdForcePost) | **POST** /api/v1/grace-holds/{hold_id}/force | Force Grace Hold |
| [**getGraceHoldApiV1GraceHoldsHoldIdGet**](GraceHoldsApi.md#getGraceHoldApiV1GraceHoldsHoldIdGet) | **GET** /api/v1/grace-holds/{hold_id} | Get Grace Hold |
| [**listGraceHoldsApiV1GraceHoldsGet**](GraceHoldsApi.md#listGraceHoldsApiV1GraceHoldsGet) | **GET** /api/v1/grace-holds | List Grace Holds |


<a id="cancelGraceHoldApiV1GraceHoldsHoldIdCancelPost"></a>
# **cancelGraceHoldApiV1GraceHoldsHoldIdCancelPost**
> GraceHold cancelGraceHoldApiV1GraceHoldsHoldIdCancelPost(holdId, graceHoldActionRequest)

Cancel Grace Hold

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GraceHoldsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GraceHoldsApi apiInstance = new GraceHoldsApi(defaultClient);
    String holdId = "holdId_example"; // String | 
    GraceHoldActionRequest graceHoldActionRequest = new GraceHoldActionRequest(); // GraceHoldActionRequest | 
    try {
      GraceHold result = apiInstance.cancelGraceHoldApiV1GraceHoldsHoldIdCancelPost(holdId, graceHoldActionRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GraceHoldsApi#cancelGraceHoldApiV1GraceHoldsHoldIdCancelPost");
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
| **holdId** | **String**|  | |
| **graceHoldActionRequest** | [**GraceHoldActionRequest**](GraceHoldActionRequest.md)|  | [optional] |

### Return type

[**GraceHold**](GraceHold.md)

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

<a id="forceGraceHoldApiV1GraceHoldsHoldIdForcePost"></a>
# **forceGraceHoldApiV1GraceHoldsHoldIdForcePost**
> GraceHold forceGraceHoldApiV1GraceHoldsHoldIdForcePost(holdId, graceHoldActionRequest)

Force Grace Hold

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GraceHoldsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GraceHoldsApi apiInstance = new GraceHoldsApi(defaultClient);
    String holdId = "holdId_example"; // String | 
    GraceHoldActionRequest graceHoldActionRequest = new GraceHoldActionRequest(); // GraceHoldActionRequest | 
    try {
      GraceHold result = apiInstance.forceGraceHoldApiV1GraceHoldsHoldIdForcePost(holdId, graceHoldActionRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GraceHoldsApi#forceGraceHoldApiV1GraceHoldsHoldIdForcePost");
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
| **holdId** | **String**|  | |
| **graceHoldActionRequest** | [**GraceHoldActionRequest**](GraceHoldActionRequest.md)|  | [optional] |

### Return type

[**GraceHold**](GraceHold.md)

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

<a id="getGraceHoldApiV1GraceHoldsHoldIdGet"></a>
# **getGraceHoldApiV1GraceHoldsHoldIdGet**
> GraceHold getGraceHoldApiV1GraceHoldsHoldIdGet(holdId)

Get Grace Hold

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GraceHoldsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GraceHoldsApi apiInstance = new GraceHoldsApi(defaultClient);
    String holdId = "holdId_example"; // String | 
    try {
      GraceHold result = apiInstance.getGraceHoldApiV1GraceHoldsHoldIdGet(holdId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GraceHoldsApi#getGraceHoldApiV1GraceHoldsHoldIdGet");
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
| **holdId** | **String**|  | |

### Return type

[**GraceHold**](GraceHold.md)

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

<a id="listGraceHoldsApiV1GraceHoldsGet"></a>
# **listGraceHoldsApiV1GraceHoldsGet**
> List&lt;GraceHold&gt; listGraceHoldsApiV1GraceHoldsGet(status, policyId, recordId, ruleId, limit, offset)

List Grace Holds

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GraceHoldsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GraceHoldsApi apiInstance = new GraceHoldsApi(defaultClient);
    GraceHoldStatus status = GraceHoldStatus.fromValue("active"); // GraceHoldStatus | 
    String policyId = "policyId_example"; // String | 
    String recordId = "recordId_example"; // String | 
    String ruleId = "ruleId_example"; // String | 
    Integer limit = 100; // Integer | 
    Integer offset = 0; // Integer | 
    try {
      List<GraceHold> result = apiInstance.listGraceHoldsApiV1GraceHoldsGet(status, policyId, recordId, ruleId, limit, offset);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GraceHoldsApi#listGraceHoldsApiV1GraceHoldsGet");
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
| **status** | [**GraceHoldStatus**](.md)|  | [optional] [enum: active, dispatched, forced, cancelled] |
| **policyId** | **String**|  | [optional] |
| **recordId** | **String**|  | [optional] |
| **ruleId** | **String**|  | [optional] |
| **limit** | **Integer**|  | [optional] [default to 100] |
| **offset** | **Integer**|  | [optional] [default to 0] |

### Return type

[**List&lt;GraceHold&gt;**](GraceHold.md)

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

