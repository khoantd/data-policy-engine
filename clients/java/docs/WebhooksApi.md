# WebhooksApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createWebhookApiV1WebhooksPost**](WebhooksApi.md#createWebhookApiV1WebhooksPost) | **POST** /api/v1/webhooks | Create Webhook |
| [**deleteWebhookApiV1WebhooksWebhookIdDelete**](WebhooksApi.md#deleteWebhookApiV1WebhooksWebhookIdDelete) | **DELETE** /api/v1/webhooks/{webhook_id} | Delete Webhook |
| [**getWebhookApiV1WebhooksWebhookIdGet**](WebhooksApi.md#getWebhookApiV1WebhooksWebhookIdGet) | **GET** /api/v1/webhooks/{webhook_id} | Get Webhook |
| [**listWebhooksApiV1WebhooksGet**](WebhooksApi.md#listWebhooksApiV1WebhooksGet) | **GET** /api/v1/webhooks | List Webhooks |
| [**updateWebhookApiV1WebhooksWebhookIdPatch**](WebhooksApi.md#updateWebhookApiV1WebhooksWebhookIdPatch) | **PATCH** /api/v1/webhooks/{webhook_id} | Update Webhook |


<a id="createWebhookApiV1WebhooksPost"></a>
# **createWebhookApiV1WebhooksPost**
> WebhookCreateResponse createWebhookApiV1WebhooksPost(webhookCreateRequest)

Create Webhook

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.WebhooksApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    WebhooksApi apiInstance = new WebhooksApi(defaultClient);
    WebhookCreateRequest webhookCreateRequest = new WebhookCreateRequest(); // WebhookCreateRequest | 
    try {
      WebhookCreateResponse result = apiInstance.createWebhookApiV1WebhooksPost(webhookCreateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling WebhooksApi#createWebhookApiV1WebhooksPost");
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
| **webhookCreateRequest** | [**WebhookCreateRequest**](WebhookCreateRequest.md)|  | |

### Return type

[**WebhookCreateResponse**](WebhookCreateResponse.md)

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

<a id="deleteWebhookApiV1WebhooksWebhookIdDelete"></a>
# **deleteWebhookApiV1WebhooksWebhookIdDelete**
> deleteWebhookApiV1WebhooksWebhookIdDelete(webhookId)

Delete Webhook

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.WebhooksApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    WebhooksApi apiInstance = new WebhooksApi(defaultClient);
    String webhookId = "webhookId_example"; // String | 
    try {
      apiInstance.deleteWebhookApiV1WebhooksWebhookIdDelete(webhookId);
    } catch (ApiException e) {
      System.err.println("Exception when calling WebhooksApi#deleteWebhookApiV1WebhooksWebhookIdDelete");
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
| **webhookId** | **String**|  | |

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

<a id="getWebhookApiV1WebhooksWebhookIdGet"></a>
# **getWebhookApiV1WebhooksWebhookIdGet**
> WebhookResponse getWebhookApiV1WebhooksWebhookIdGet(webhookId)

Get Webhook

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.WebhooksApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    WebhooksApi apiInstance = new WebhooksApi(defaultClient);
    String webhookId = "webhookId_example"; // String | 
    try {
      WebhookResponse result = apiInstance.getWebhookApiV1WebhooksWebhookIdGet(webhookId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling WebhooksApi#getWebhookApiV1WebhooksWebhookIdGet");
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
| **webhookId** | **String**|  | |

### Return type

[**WebhookResponse**](WebhookResponse.md)

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

<a id="listWebhooksApiV1WebhooksGet"></a>
# **listWebhooksApiV1WebhooksGet**
> List&lt;WebhookResponse&gt; listWebhooksApiV1WebhooksGet(active, limit, offset)

List Webhooks

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.WebhooksApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    WebhooksApi apiInstance = new WebhooksApi(defaultClient);
    Boolean active = true; // Boolean | 
    Integer limit = 100; // Integer | 
    Integer offset = 0; // Integer | 
    try {
      List<WebhookResponse> result = apiInstance.listWebhooksApiV1WebhooksGet(active, limit, offset);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling WebhooksApi#listWebhooksApiV1WebhooksGet");
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
| **active** | **Boolean**|  | [optional] |
| **limit** | **Integer**|  | [optional] [default to 100] |
| **offset** | **Integer**|  | [optional] [default to 0] |

### Return type

[**List&lt;WebhookResponse&gt;**](WebhookResponse.md)

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

<a id="updateWebhookApiV1WebhooksWebhookIdPatch"></a>
# **updateWebhookApiV1WebhooksWebhookIdPatch**
> WebhookResponse updateWebhookApiV1WebhooksWebhookIdPatch(webhookId, webhookUpdateRequest)

Update Webhook

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.WebhooksApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    WebhooksApi apiInstance = new WebhooksApi(defaultClient);
    String webhookId = "webhookId_example"; // String | 
    WebhookUpdateRequest webhookUpdateRequest = new WebhookUpdateRequest(); // WebhookUpdateRequest | 
    try {
      WebhookResponse result = apiInstance.updateWebhookApiV1WebhooksWebhookIdPatch(webhookId, webhookUpdateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling WebhooksApi#updateWebhookApiV1WebhooksWebhookIdPatch");
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
| **webhookId** | **String**|  | |
| **webhookUpdateRequest** | [**WebhookUpdateRequest**](WebhookUpdateRequest.md)|  | |

### Return type

[**WebhookResponse**](WebhookResponse.md)

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

