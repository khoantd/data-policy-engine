# PoliciesApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**activatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost**](PoliciesApi.md#activatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost) | **POST** /api/v1/policies/{policy_id}/versions/{ver}/activate | Activate Policy Version |
| [**changePolicyStatusApiV1PoliciesPolicyIdStatusPost**](PoliciesApi.md#changePolicyStatusApiV1PoliciesPolicyIdStatusPost) | **POST** /api/v1/policies/{policy_id}/status | Change Policy Status |
| [**createPolicyApiV1PoliciesPost**](PoliciesApi.md#createPolicyApiV1PoliciesPost) | **POST** /api/v1/policies | Create Policy |
| [**deletePolicyApiV1PoliciesPolicyIdDelete**](PoliciesApi.md#deletePolicyApiV1PoliciesPolicyIdDelete) | **DELETE** /api/v1/policies/{policy_id} | Delete Policy |
| [**diffPolicyVersionsApiV1PoliciesPolicyIdDiffPost**](PoliciesApi.md#diffPolicyVersionsApiV1PoliciesPolicyIdDiffPost) | **POST** /api/v1/policies/{policy_id}/diff | Diff Policy Versions |
| [**getPolicyApiV1PoliciesPolicyIdGet**](PoliciesApi.md#getPolicyApiV1PoliciesPolicyIdGet) | **GET** /api/v1/policies/{policy_id} | Get Policy |
| [**getPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet**](PoliciesApi.md#getPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet) | **GET** /api/v1/policies/{policy_id}/versions/{ver} | Get Policy Version |
| [**importPoliciesApiV1PoliciesImportPost**](PoliciesApi.md#importPoliciesApiV1PoliciesImportPost) | **POST** /api/v1/policies/import | Import Policies |
| [**listPoliciesApiV1PoliciesGet**](PoliciesApi.md#listPoliciesApiV1PoliciesGet) | **GET** /api/v1/policies | List Policies |
| [**listPolicyVersionsApiV1PoliciesPolicyIdVersionsGet**](PoliciesApi.md#listPolicyVersionsApiV1PoliciesPolicyIdVersionsGet) | **GET** /api/v1/policies/{policy_id}/versions | List Policy Versions |
| [**updatePolicyApiV1PoliciesPolicyIdPut**](PoliciesApi.md#updatePolicyApiV1PoliciesPolicyIdPut) | **PUT** /api/v1/policies/{policy_id} | Update Policy |
| [**validatePolicyApiV1PoliciesValidatePost**](PoliciesApi.md#validatePolicyApiV1PoliciesValidatePost) | **POST** /api/v1/policies/validate | Validate Policy |


<a id="activatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost"></a>
# **activatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost**
> Object activatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost(policyId, ver)

Activate Policy Version

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    Integer ver = 56; // Integer | 
    try {
      Object result = apiInstance.activatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost(policyId, ver);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#activatePolicyVersionApiV1PoliciesPolicyIdVersionsVerActivatePost");
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
| **ver** | **Integer**|  | |

### Return type

**Object**

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

<a id="changePolicyStatusApiV1PoliciesPolicyIdStatusPost"></a>
# **changePolicyStatusApiV1PoliciesPolicyIdStatusPost**
> Object changePolicyStatusApiV1PoliciesPolicyIdStatusPost(policyId, policyStatusChangeRequest)

Change Policy Status

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    PolicyStatusChangeRequest policyStatusChangeRequest = new PolicyStatusChangeRequest(); // PolicyStatusChangeRequest | 
    try {
      Object result = apiInstance.changePolicyStatusApiV1PoliciesPolicyIdStatusPost(policyId, policyStatusChangeRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#changePolicyStatusApiV1PoliciesPolicyIdStatusPost");
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
| **policyStatusChangeRequest** | [**PolicyStatusChangeRequest**](PolicyStatusChangeRequest.md)|  | |

### Return type

**Object**

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

<a id="createPolicyApiV1PoliciesPost"></a>
# **createPolicyApiV1PoliciesPost**
> Object createPolicyApiV1PoliciesPost(policyCreateRequest)

Create Policy

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    PolicyCreateRequest policyCreateRequest = new PolicyCreateRequest(); // PolicyCreateRequest | 
    try {
      Object result = apiInstance.createPolicyApiV1PoliciesPost(policyCreateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#createPolicyApiV1PoliciesPost");
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
| **policyCreateRequest** | [**PolicyCreateRequest**](PolicyCreateRequest.md)|  | |

### Return type

**Object**

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

<a id="deletePolicyApiV1PoliciesPolicyIdDelete"></a>
# **deletePolicyApiV1PoliciesPolicyIdDelete**
> Object deletePolicyApiV1PoliciesPolicyIdDelete(policyId)

Delete Policy

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    try {
      Object result = apiInstance.deletePolicyApiV1PoliciesPolicyIdDelete(policyId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#deletePolicyApiV1PoliciesPolicyIdDelete");
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

**Object**

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

<a id="diffPolicyVersionsApiV1PoliciesPolicyIdDiffPost"></a>
# **diffPolicyVersionsApiV1PoliciesPolicyIdDiffPost**
> PolicyDiffResponse diffPolicyVersionsApiV1PoliciesPolicyIdDiffPost(policyId, policyDiffRequest)

Diff Policy Versions

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    PolicyDiffRequest policyDiffRequest = new PolicyDiffRequest(); // PolicyDiffRequest | 
    try {
      PolicyDiffResponse result = apiInstance.diffPolicyVersionsApiV1PoliciesPolicyIdDiffPost(policyId, policyDiffRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#diffPolicyVersionsApiV1PoliciesPolicyIdDiffPost");
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
| **policyDiffRequest** | [**PolicyDiffRequest**](PolicyDiffRequest.md)|  | |

### Return type

[**PolicyDiffResponse**](PolicyDiffResponse.md)

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

<a id="getPolicyApiV1PoliciesPolicyIdGet"></a>
# **getPolicyApiV1PoliciesPolicyIdGet**
> Object getPolicyApiV1PoliciesPolicyIdGet(policyId)

Get Policy

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    try {
      Object result = apiInstance.getPolicyApiV1PoliciesPolicyIdGet(policyId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#getPolicyApiV1PoliciesPolicyIdGet");
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

**Object**

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

<a id="getPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet"></a>
# **getPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet**
> Object getPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet(policyId, ver)

Get Policy Version

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    Integer ver = 56; // Integer | 
    try {
      Object result = apiInstance.getPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet(policyId, ver);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#getPolicyVersionApiV1PoliciesPolicyIdVersionsVerGet");
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
| **ver** | **Integer**|  | |

### Return type

**Object**

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

<a id="importPoliciesApiV1PoliciesImportPost"></a>
# **importPoliciesApiV1PoliciesImportPost**
> ImportResponse importPoliciesApiV1PoliciesImportPost(importRequest)

Import Policies

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    ImportRequest importRequest = new ImportRequest(); // ImportRequest | 
    try {
      ImportResponse result = apiInstance.importPoliciesApiV1PoliciesImportPost(importRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#importPoliciesApiV1PoliciesImportPost");
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
| **importRequest** | [**ImportRequest**](ImportRequest.md)|  | |

### Return type

[**ImportResponse**](ImportResponse.md)

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

<a id="listPoliciesApiV1PoliciesGet"></a>
# **listPoliciesApiV1PoliciesGet**
> List&lt;PolicyListItem&gt; listPoliciesApiV1PoliciesGet(statusFilter, policyKind)

List Policies

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    String statusFilter = "statusFilter_example"; // String | 
    PolicyKind policyKind = PolicyKind.fromValue("retention"); // PolicyKind | 
    try {
      List<PolicyListItem> result = apiInstance.listPoliciesApiV1PoliciesGet(statusFilter, policyKind);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#listPoliciesApiV1PoliciesGet");
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
| **statusFilter** | **String**|  | [optional] |
| **policyKind** | [**PolicyKind**](.md)|  | [optional] [enum: retention, classification] |

### Return type

[**List&lt;PolicyListItem&gt;**](PolicyListItem.md)

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

<a id="listPolicyVersionsApiV1PoliciesPolicyIdVersionsGet"></a>
# **listPolicyVersionsApiV1PoliciesPolicyIdVersionsGet**
> List&lt;PolicyVersionInfo&gt; listPolicyVersionsApiV1PoliciesPolicyIdVersionsGet(policyId)

List Policy Versions

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    try {
      List<PolicyVersionInfo> result = apiInstance.listPolicyVersionsApiV1PoliciesPolicyIdVersionsGet(policyId);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#listPolicyVersionsApiV1PoliciesPolicyIdVersionsGet");
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

[**List&lt;PolicyVersionInfo&gt;**](PolicyVersionInfo.md)

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

<a id="updatePolicyApiV1PoliciesPolicyIdPut"></a>
# **updatePolicyApiV1PoliciesPolicyIdPut**
> Object updatePolicyApiV1PoliciesPolicyIdPut(policyId, policyCreateRequest)

Update Policy

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    String policyId = "policyId_example"; // String | 
    PolicyCreateRequest policyCreateRequest = new PolicyCreateRequest(); // PolicyCreateRequest | 
    try {
      Object result = apiInstance.updatePolicyApiV1PoliciesPolicyIdPut(policyId, policyCreateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#updatePolicyApiV1PoliciesPolicyIdPut");
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
| **policyCreateRequest** | [**PolicyCreateRequest**](PolicyCreateRequest.md)|  | |

### Return type

**Object**

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

<a id="validatePolicyApiV1PoliciesValidatePost"></a>
# **validatePolicyApiV1PoliciesValidatePost**
> ValidateResponse validatePolicyApiV1PoliciesValidatePost(validateRequest)

Validate Policy

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.PoliciesApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    PoliciesApi apiInstance = new PoliciesApi(defaultClient);
    ValidateRequest validateRequest = new ValidateRequest(); // ValidateRequest | 
    try {
      ValidateResponse result = apiInstance.validatePolicyApiV1PoliciesValidatePost(validateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling PoliciesApi#validatePolicyApiV1PoliciesValidatePost");
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
| **validateRequest** | [**ValidateRequest**](ValidateRequest.md)|  | |

### Return type

[**ValidateResponse**](ValidateResponse.md)

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

