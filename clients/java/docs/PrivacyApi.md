# PrivacyApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**privacyMaskApiV1PrivacyMaskPost**](PrivacyApi.md#privacyMaskApiV1PrivacyMaskPost) | **POST** /api/v1/privacy/mask | Privacy Mask |
| [**privacyStatusApiV1PrivacyStatusGet**](PrivacyApi.md#privacyStatusApiV1PrivacyStatusGet) | **GET** /api/v1/privacy/status | Privacy Status |
| [**privacyUnmaskApiV1PrivacyUnmaskPost**](PrivacyApi.md#privacyUnmaskApiV1PrivacyUnmaskPost) | **POST** /api/v1/privacy/unmask | Privacy Unmask |


<a id="privacyMaskApiV1PrivacyMaskPost"></a>
# **privacyMaskApiV1PrivacyMaskPost**
> MaskResponse privacyMaskApiV1PrivacyMaskPost(maskRequest)

Privacy Mask

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PrivacyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PrivacyApi apiInstance = new PrivacyApi(defaultClient);
    MaskRequest maskRequest = new MaskRequest(); // MaskRequest | 
    try {
      MaskResponse result = apiInstance.privacyMaskApiV1PrivacyMaskPost(maskRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PrivacyApi#privacyMaskApiV1PrivacyMaskPost");
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
| **maskRequest** | [**MaskRequest**](MaskRequest.md)|  | |

### Return type

[**MaskResponse**](MaskResponse.md)

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

<a id="privacyStatusApiV1PrivacyStatusGet"></a>
# **privacyStatusApiV1PrivacyStatusGet**
> PrivacyStatusResponse privacyStatusApiV1PrivacyStatusGet()

Privacy Status

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PrivacyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PrivacyApi apiInstance = new PrivacyApi(defaultClient);
    try {
      PrivacyStatusResponse result = apiInstance.privacyStatusApiV1PrivacyStatusGet();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PrivacyApi#privacyStatusApiV1PrivacyStatusGet");
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

[**PrivacyStatusResponse**](PrivacyStatusResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

<a id="privacyUnmaskApiV1PrivacyUnmaskPost"></a>
# **privacyUnmaskApiV1PrivacyUnmaskPost**
> UnmaskResponse privacyUnmaskApiV1PrivacyUnmaskPost(unmaskRequest)

Privacy Unmask

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PrivacyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PrivacyApi apiInstance = new PrivacyApi(defaultClient);
    UnmaskRequest unmaskRequest = new UnmaskRequest(); // UnmaskRequest | 
    try {
      UnmaskResponse result = apiInstance.privacyUnmaskApiV1PrivacyUnmaskPost(unmaskRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PrivacyApi#privacyUnmaskApiV1PrivacyUnmaskPost");
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
| **unmaskRequest** | [**UnmaskRequest**](UnmaskRequest.md)|  | |

### Return type

[**UnmaskResponse**](UnmaskResponse.md)

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

