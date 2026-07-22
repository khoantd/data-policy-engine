# ClassifyApi

All URIs are relative to *http://localhost:8000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**classifyBatchApiV1ClassifyBatchPost**](ClassifyApi.md#classifyBatchApiV1ClassifyBatchPost) | **POST** /api/v1/classify/batch | Classify Batch |
| [**classifyDryRunApiV1ClassifyDryRunPost**](ClassifyApi.md#classifyDryRunApiV1ClassifyDryRunPost) | **POST** /api/v1/classify/dry-run | Classify Dry Run |
| [**classifyOneApiV1ClassifyPost**](ClassifyApi.md#classifyOneApiV1ClassifyPost) | **POST** /api/v1/classify | Classify One |


<a id="classifyBatchApiV1ClassifyBatchPost"></a>
# **classifyBatchApiV1ClassifyBatchPost**
> List&lt;ClassificationResponse&gt; classifyBatchApiV1ClassifyBatchPost(batchClassificationRequest)

Classify Batch

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.ClassifyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    ClassifyApi apiInstance = new ClassifyApi(defaultClient);
    BatchClassificationRequest batchClassificationRequest = new BatchClassificationRequest(); // BatchClassificationRequest | 
    try {
      List<ClassificationResponse> result = apiInstance.classifyBatchApiV1ClassifyBatchPost(batchClassificationRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ClassifyApi#classifyBatchApiV1ClassifyBatchPost");
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
| **batchClassificationRequest** | [**BatchClassificationRequest**](BatchClassificationRequest.md)|  | |

### Return type

[**List&lt;ClassificationResponse&gt;**](ClassificationResponse.md)

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

<a id="classifyDryRunApiV1ClassifyDryRunPost"></a>
# **classifyDryRunApiV1ClassifyDryRunPost**
> ClassificationResponse classifyDryRunApiV1ClassifyDryRunPost(classificationRequest)

Classify Dry Run

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.ClassifyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    ClassifyApi apiInstance = new ClassifyApi(defaultClient);
    ClassificationRequest classificationRequest = new ClassificationRequest(); // ClassificationRequest | 
    try {
      ClassificationResponse result = apiInstance.classifyDryRunApiV1ClassifyDryRunPost(classificationRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ClassifyApi#classifyDryRunApiV1ClassifyDryRunPost");
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
| **classificationRequest** | [**ClassificationRequest**](ClassificationRequest.md)|  | |

### Return type

[**ClassificationResponse**](ClassificationResponse.md)

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

<a id="classifyOneApiV1ClassifyPost"></a>
# **classifyOneApiV1ClassifyPost**
> ClassificationResponse classifyOneApiV1ClassifyPost(classificationRequest)

Classify One

### Example
```java
// Import classes:
import com.drpe.client.ApiClient;
import com.drpe.client.ApiException;
import com.drpe.client.Configuration;
import com.drpe.client.auth.*;
import com.drpe.client.models.*;
import com.drpe.client.api.ClassifyApi;

public class Example {
  public static void main(String[] args) {
    ApiClient defaultClient = Configuration.getDefaultApiClient();
    defaultClient.setBasePath("http://localhost:8000");
    
    // Configure HTTP bearer authorization: BearerAuth
    HttpBearerAuth BearerAuth = (HttpBearerAuth) defaultClient.getAuthentication("BearerAuth");
    BearerAuth.setBearerToken("BEARER TOKEN");

    ClassifyApi apiInstance = new ClassifyApi(defaultClient);
    ClassificationRequest classificationRequest = new ClassificationRequest(); // ClassificationRequest | 
    try {
      ClassificationResponse result = apiInstance.classifyOneApiV1ClassifyPost(classificationRequest);
      System.out.println(result);
    } catch (ApiException e) {
      System.err.println("Exception when calling ClassifyApi#classifyOneApiV1ClassifyPost");
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
| **classificationRequest** | [**ClassificationRequest**](ClassificationRequest.md)|  | |

### Return type

[**ClassificationResponse**](ClassificationResponse.md)

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

