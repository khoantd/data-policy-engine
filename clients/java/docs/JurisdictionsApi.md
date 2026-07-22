# JurisdictionsApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getOneApiV1JurisdictionsCodeGet**](JurisdictionsApi.md#getOneApiV1JurisdictionsCodeGet) | **GET** /api/v1/jurisdictions/{code} | Get One |
| [**listAllApiV1JurisdictionsGet**](JurisdictionsApi.md#listAllApiV1JurisdictionsGet) | **GET** /api/v1/jurisdictions | List All |


<a id="getOneApiV1JurisdictionsCodeGet"></a>
# **getOneApiV1JurisdictionsCodeGet**
> Map&lt;String, Object&gt; getOneApiV1JurisdictionsCodeGet(code)

Get One

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.JurisdictionsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    JurisdictionsApi apiInstance = new JurisdictionsApi(defaultClient);
    String code = "code_example"; // String | 
    try {
      Map<String, Object> result = apiInstance.getOneApiV1JurisdictionsCodeGet(code);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling JurisdictionsApi#getOneApiV1JurisdictionsCodeGet");
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
| **code** | **String**|  | |

### Return type

**Map&lt;String, Object&gt;**

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

<a id="listAllApiV1JurisdictionsGet"></a>
# **listAllApiV1JurisdictionsGet**
> List&lt;Map&lt;String, Object&gt;&gt; listAllApiV1JurisdictionsGet()

List All

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.JurisdictionsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    JurisdictionsApi apiInstance = new JurisdictionsApi(defaultClient);
    try {
      List<Map<String, Object>> result = apiInstance.listAllApiV1JurisdictionsGet();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling JurisdictionsApi#listAllApiV1JurisdictionsGet");
      System.err.println("Status code: " + e.getCode());
      System.err.println("Reason: " + e.getResponseBody());
      System.err.println("Response headers: " + e.getResponseHeaders());
      e.printStackTrace();
    }
  }
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**List&lt;Map&lt;String, Object&gt;&gt;**](Map.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

