# EvaluateApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**evaluateBatchApiV1EvaluateBatchPost**](EvaluateApi.md#evaluateBatchApiV1EvaluateBatchPost) | **POST** /api/v1/evaluate/batch | Evaluate Batch |
| [**evaluateDryRunApiV1EvaluateDryRunPost**](EvaluateApi.md#evaluateDryRunApiV1EvaluateDryRunPost) | **POST** /api/v1/evaluate/dry-run | Evaluate Dry Run |
| [**evaluateOneApiV1EvaluatePost**](EvaluateApi.md#evaluateOneApiV1EvaluatePost) | **POST** /api/v1/evaluate | Evaluate One |


<a id="evaluateBatchApiV1EvaluateBatchPost"></a>
# **evaluateBatchApiV1EvaluateBatchPost**
> List&lt;EvaluationResponse&gt; evaluateBatchApiV1EvaluateBatchPost(batchEvaluateRequest)

Evaluate Batch

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.EvaluateApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    EvaluateApi apiInstance = new EvaluateApi(defaultClient);
    BatchEvaluateRequest batchEvaluateRequest = new BatchEvaluateRequest(); // BatchEvaluateRequest | 
    try {
      List<EvaluationResponse> result = apiInstance.evaluateBatchApiV1EvaluateBatchPost(batchEvaluateRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EvaluateApi#evaluateBatchApiV1EvaluateBatchPost");
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
| **batchEvaluateRequest** | [**BatchEvaluateRequest**](BatchEvaluateRequest.md)|  | |

### Return type

[**List&lt;EvaluationResponse&gt;**](EvaluationResponse.md)

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

<a id="evaluateDryRunApiV1EvaluateDryRunPost"></a>
# **evaluateDryRunApiV1EvaluateDryRunPost**
> EvaluationResponse evaluateDryRunApiV1EvaluateDryRunPost(evaluationRequest)

Evaluate Dry Run

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.EvaluateApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    EvaluateApi apiInstance = new EvaluateApi(defaultClient);
    EvaluationRequest evaluationRequest = new EvaluationRequest(); // EvaluationRequest | 
    try {
      EvaluationResponse result = apiInstance.evaluateDryRunApiV1EvaluateDryRunPost(evaluationRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EvaluateApi#evaluateDryRunApiV1EvaluateDryRunPost");
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
| **evaluationRequest** | [**EvaluationRequest**](EvaluationRequest.md)|  | |

### Return type

[**EvaluationResponse**](EvaluationResponse.md)

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

<a id="evaluateOneApiV1EvaluatePost"></a>
# **evaluateOneApiV1EvaluatePost**
> EvaluationResponse evaluateOneApiV1EvaluatePost(evaluationRequest)

Evaluate One

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.EvaluateApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    EvaluateApi apiInstance = new EvaluateApi(defaultClient);
    EvaluationRequest evaluationRequest = new EvaluationRequest(); // EvaluationRequest | 
    try {
      EvaluationResponse result = apiInstance.evaluateOneApiV1EvaluatePost(evaluationRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling EvaluateApi#evaluateOneApiV1EvaluatePost");
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
| **evaluationRequest** | [**EvaluationRequest**](EvaluationRequest.md)|  | |

### Return type

[**EvaluationResponse**](EvaluationResponse.md)

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

