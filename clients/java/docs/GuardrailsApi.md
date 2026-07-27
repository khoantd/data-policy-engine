# GuardrailsApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createGuardrailPolicyApiV1GuardrailsPoliciesPost**](GuardrailsApi.md#createGuardrailPolicyApiV1GuardrailsPoliciesPost) | **POST** /api/v1/guardrails/policies | Create Guardrail Policy |
| [**deleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete**](GuardrailsApi.md#deleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete) | **DELETE** /api/v1/guardrails/policies/{policy_id} | Delete Guardrail Policy |
| [**evaluateGuardEventApiV1GuardrailsEvaluatePost**](GuardrailsApi.md#evaluateGuardEventApiV1GuardrailsEvaluatePost) | **POST** /api/v1/guardrails/evaluate | Evaluate Guard Event |
| [**getGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet**](GuardrailsApi.md#getGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet) | **GET** /api/v1/guardrails/policies/{policy_id} | Get Guardrail Policy |
| [**guardrailsStatusApiV1GuardrailsStatusGet**](GuardrailsApi.md#guardrailsStatusApiV1GuardrailsStatusGet) | **GET** /api/v1/guardrails/status | Guardrails Status |
| [**listGuardrailPoliciesApiV1GuardrailsPoliciesGet**](GuardrailsApi.md#listGuardrailPoliciesApiV1GuardrailsPoliciesGet) | **GET** /api/v1/guardrails/policies | List Guardrail Policies |
| [**updateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut**](GuardrailsApi.md#updateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut) | **PUT** /api/v1/guardrails/policies/{policy_id} | Update Guardrail Policy |


<a id="createGuardrailPolicyApiV1GuardrailsPoliciesPost"></a>
# **createGuardrailPolicyApiV1GuardrailsPoliciesPost**
> GuardrailPolicyResponse createGuardrailPolicyApiV1GuardrailsPoliciesPost(guardrailPolicyCreateRequest)

Create Guardrail Policy

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GuardrailsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GuardrailsApi apiInstance = new GuardrailsApi(defaultClient);
    GuardrailPolicyCreateRequest guardrailPolicyCreateRequest = new GuardrailPolicyCreateRequest(); // GuardrailPolicyCreateRequest | 
    try {
      GuardrailPolicyResponse result = apiInstance.createGuardrailPolicyApiV1GuardrailsPoliciesPost(guardrailPolicyCreateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GuardrailsApi#createGuardrailPolicyApiV1GuardrailsPoliciesPost");
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
| **guardrailPolicyCreateRequest** | [**GuardrailPolicyCreateRequest**](GuardrailPolicyCreateRequest.md)|  | |

### Return type

[**GuardrailPolicyResponse**](GuardrailPolicyResponse.md)

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

<a id="deleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete"></a>
# **deleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete**
> deleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete(policyId)

Delete Guardrail Policy

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GuardrailsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GuardrailsApi apiInstance = new GuardrailsApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    try {
      apiInstance.deleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete(policyId);
    } catch (ApiException e) {
      System.err.println("Exception when calling GuardrailsApi#deleteGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdDelete");
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
| **policyId** | **String**|  | |

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

<a id="evaluateGuardEventApiV1GuardrailsEvaluatePost"></a>
# **evaluateGuardEventApiV1GuardrailsEvaluatePost**
> VerdictResponse evaluateGuardEventApiV1GuardrailsEvaluatePost(evaluateRequest)

Evaluate Guard Event

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GuardrailsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GuardrailsApi apiInstance = new GuardrailsApi(defaultClient);
    EvaluateRequest evaluateRequest = new EvaluateRequest(); // EvaluateRequest | 
    try {
      VerdictResponse result = apiInstance.evaluateGuardEventApiV1GuardrailsEvaluatePost(evaluateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GuardrailsApi#evaluateGuardEventApiV1GuardrailsEvaluatePost");
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
| **evaluateRequest** | [**EvaluateRequest**](EvaluateRequest.md)|  | |

### Return type

[**VerdictResponse**](VerdictResponse.md)

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

<a id="getGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet"></a>
# **getGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet**
> GuardrailPolicyResponse getGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet(policyId)

Get Guardrail Policy

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GuardrailsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GuardrailsApi apiInstance = new GuardrailsApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    try {
      GuardrailPolicyResponse result = apiInstance.getGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet(policyId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GuardrailsApi#getGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdGet");
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
| **policyId** | **String**|  | |

### Return type

[**GuardrailPolicyResponse**](GuardrailPolicyResponse.md)

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

<a id="guardrailsStatusApiV1GuardrailsStatusGet"></a>
# **guardrailsStatusApiV1GuardrailsStatusGet**
> GuardrailsStatusResponse guardrailsStatusApiV1GuardrailsStatusGet()

Guardrails Status

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GuardrailsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GuardrailsApi apiInstance = new GuardrailsApi(defaultClient);
    try {
      GuardrailsStatusResponse result = apiInstance.guardrailsStatusApiV1GuardrailsStatusGet();
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GuardrailsApi#guardrailsStatusApiV1GuardrailsStatusGet");
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

[**GuardrailsStatusResponse**](GuardrailsStatusResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |

<a id="listGuardrailPoliciesApiV1GuardrailsPoliciesGet"></a>
# **listGuardrailPoliciesApiV1GuardrailsPoliciesGet**
> List&lt;GuardrailPolicyResponse&gt; listGuardrailPoliciesApiV1GuardrailsPoliciesGet(limit, offset)

List Guardrail Policies

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GuardrailsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GuardrailsApi apiInstance = new GuardrailsApi(defaultClient);
    Integer limit = 100; // Integer | 
    Integer offset = 0; // Integer | 
    try {
      List<GuardrailPolicyResponse> result = apiInstance.listGuardrailPoliciesApiV1GuardrailsPoliciesGet(limit, offset);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GuardrailsApi#listGuardrailPoliciesApiV1GuardrailsPoliciesGet");
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
| **limit** | **Integer**|  | [optional] [default to 100] |
| **offset** | **Integer**|  | [optional] [default to 0] |

### Return type

[**List&lt;GuardrailPolicyResponse&gt;**](GuardrailPolicyResponse.md)

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

<a id="updateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut"></a>
# **updateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut**
> GuardrailPolicyResponse updateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut(policyId, guardrailPolicyUpdateRequest)

Update Guardrail Policy

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.GuardrailsApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    GuardrailsApi apiInstance = new GuardrailsApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    GuardrailPolicyUpdateRequest guardrailPolicyUpdateRequest = new GuardrailPolicyUpdateRequest(); // GuardrailPolicyUpdateRequest | 
    try {
      GuardrailPolicyResponse result = apiInstance.updateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut(policyId, guardrailPolicyUpdateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling GuardrailsApi#updateGuardrailPolicyApiV1GuardrailsPoliciesPolicyIdPut");
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
| **policyId** | **String**|  | |
| **guardrailPolicyUpdateRequest** | [**GuardrailPolicyUpdateRequest**](GuardrailPolicyUpdateRequest.md)|  | |

### Return type

[**GuardrailPolicyResponse**](GuardrailPolicyResponse.md)

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

