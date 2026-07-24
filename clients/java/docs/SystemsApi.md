# SystemsApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createSystemApiV1SystemsPost**](SystemsApi.md#createSystemApiV1SystemsPost) | **POST** /api/v1/systems | Create System |
| [**deleteSystemApiV1SystemsSystemIdDelete**](SystemsApi.md#deleteSystemApiV1SystemsSystemIdDelete) | **DELETE** /api/v1/systems/{system_id} | Delete System |
| [**getSystemApiV1SystemsSystemIdGet**](SystemsApi.md#getSystemApiV1SystemsSystemIdGet) | **GET** /api/v1/systems/{system_id} | Get System |
| [**listSystemPoliciesApiV1SystemsSystemIdPoliciesGet**](SystemsApi.md#listSystemPoliciesApiV1SystemsSystemIdPoliciesGet) | **GET** /api/v1/systems/{system_id}/policies | List System Policies |
| [**listSystemsApiV1SystemsGet**](SystemsApi.md#listSystemsApiV1SystemsGet) | **GET** /api/v1/systems | List Systems |
| [**setSystemPoliciesApiV1SystemsSystemIdPoliciesPut**](SystemsApi.md#setSystemPoliciesApiV1SystemsSystemIdPoliciesPut) | **PUT** /api/v1/systems/{system_id}/policies | Set System Policies |
| [**updateSystemApiV1SystemsSystemIdPatch**](SystemsApi.md#updateSystemApiV1SystemsSystemIdPatch) | **PATCH** /api/v1/systems/{system_id} | Update System |


<a id="createSystemApiV1SystemsPost"></a>
# **createSystemApiV1SystemsPost**
> SystemResponse createSystemApiV1SystemsPost(systemCreateRequest)

Create System

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.SystemsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    SystemsApi apiInstance = new SystemsApi(defaultClient);
    SystemCreateRequest systemCreateRequest = new SystemCreateRequest(); // SystemCreateRequest | 
    try {
      SystemResponse result = apiInstance.createSystemApiV1SystemsPost(systemCreateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling SystemsApi#createSystemApiV1SystemsPost");
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
| **systemCreateRequest** | [**SystemCreateRequest**](SystemCreateRequest.md)|  | |

### Return type

[**SystemResponse**](SystemResponse.md)

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

<a id="deleteSystemApiV1SystemsSystemIdDelete"></a>
# **deleteSystemApiV1SystemsSystemIdDelete**
> deleteSystemApiV1SystemsSystemIdDelete(systemId)

Delete System

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.SystemsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    SystemsApi apiInstance = new SystemsApi(defaultClient);
    String systemId = "systemId_example"; // String | 
    try {
      apiInstance.deleteSystemApiV1SystemsSystemIdDelete(systemId);
    } catch (ApiException e) {
      System.err.println("Exception when calling SystemsApi#deleteSystemApiV1SystemsSystemIdDelete");
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
| **systemId** | **String**|  | |

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

<a id="getSystemApiV1SystemsSystemIdGet"></a>
# **getSystemApiV1SystemsSystemIdGet**
> SystemResponse getSystemApiV1SystemsSystemIdGet(systemId)

Get System

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.SystemsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    SystemsApi apiInstance = new SystemsApi(defaultClient);
    String systemId = "systemId_example"; // String | 
    try {
      SystemResponse result = apiInstance.getSystemApiV1SystemsSystemIdGet(systemId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling SystemsApi#getSystemApiV1SystemsSystemIdGet");
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
| **systemId** | **String**|  | |

### Return type

[**SystemResponse**](SystemResponse.md)

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

<a id="listSystemPoliciesApiV1SystemsSystemIdPoliciesGet"></a>
# **listSystemPoliciesApiV1SystemsSystemIdPoliciesGet**
> List&lt;String&gt; listSystemPoliciesApiV1SystemsSystemIdPoliciesGet(systemId)

List System Policies

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.SystemsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    SystemsApi apiInstance = new SystemsApi(defaultClient);
    String systemId = "systemId_example"; // String | 
    try {
      List<String> result = apiInstance.listSystemPoliciesApiV1SystemsSystemIdPoliciesGet(systemId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling SystemsApi#listSystemPoliciesApiV1SystemsSystemIdPoliciesGet");
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
| **systemId** | **String**|  | |

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

<a id="listSystemsApiV1SystemsGet"></a>
# **listSystemsApiV1SystemsGet**
> List&lt;SystemResponse&gt; listSystemsApiV1SystemsGet(status, limit, offset)

List Systems

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.SystemsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    SystemsApi apiInstance = new SystemsApi(defaultClient);
    CatalogStatus status = CatalogStatus.fromValue("active"); // CatalogStatus | 
    Integer limit = 100; // Integer | 
    Integer offset = 0; // Integer | 
    try {
      List<SystemResponse> result = apiInstance.listSystemsApiV1SystemsGet(status, limit, offset);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling SystemsApi#listSystemsApiV1SystemsGet");
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

[**List&lt;SystemResponse&gt;**](SystemResponse.md)

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

<a id="setSystemPoliciesApiV1SystemsSystemIdPoliciesPut"></a>
# **setSystemPoliciesApiV1SystemsSystemIdPoliciesPut**
> List&lt;String&gt; setSystemPoliciesApiV1SystemsSystemIdPoliciesPut(systemId, policyIdsRequest)

Set System Policies

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.SystemsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    SystemsApi apiInstance = new SystemsApi(defaultClient);
    String systemId = "systemId_example"; // String | 
    PolicyIdsRequest policyIdsRequest = new PolicyIdsRequest(); // PolicyIdsRequest | 
    try {
      List<String> result = apiInstance.setSystemPoliciesApiV1SystemsSystemIdPoliciesPut(systemId, policyIdsRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling SystemsApi#setSystemPoliciesApiV1SystemsSystemIdPoliciesPut");
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
| **systemId** | **String**|  | |
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

<a id="updateSystemApiV1SystemsSystemIdPatch"></a>
# **updateSystemApiV1SystemsSystemIdPatch**
> SystemResponse updateSystemApiV1SystemsSystemIdPatch(systemId, systemUpdateRequest)

Update System

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.SystemsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    SystemsApi apiInstance = new SystemsApi(defaultClient);
    String systemId = "systemId_example"; // String | 
    SystemUpdateRequest systemUpdateRequest = new SystemUpdateRequest(); // SystemUpdateRequest | 
    try {
      SystemResponse result = apiInstance.updateSystemApiV1SystemsSystemIdPatch(systemId, systemUpdateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling SystemsApi#updateSystemApiV1SystemsSystemIdPatch");
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
| **systemId** | **String**|  | |
| **systemUpdateRequest** | [**SystemUpdateRequest**](SystemUpdateRequest.md)|  | |

### Return type

[**SystemResponse**](SystemResponse.md)

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

