# ClassificationDiagnostics

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**ApplicablePolicyCount** | Pointer to **int32** |  | [optional] [default to 0]
**SelectedPolicyApplied** | Pointer to **bool** |  | [optional] [default to false]
**OutOfScopeReason** | Pointer to **string** |  | [optional] [default to "none"]
**PolicyScopeSummary** | Pointer to [**NullableClassificationPolicyScopeSummary**](ClassificationPolicyScopeSummary.md) |  | [optional] 

## Methods

### NewClassificationDiagnostics

`func NewClassificationDiagnostics() *ClassificationDiagnostics`

NewClassificationDiagnostics instantiates a new ClassificationDiagnostics object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewClassificationDiagnosticsWithDefaults

`func NewClassificationDiagnosticsWithDefaults() *ClassificationDiagnostics`

NewClassificationDiagnosticsWithDefaults instantiates a new ClassificationDiagnostics object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetApplicablePolicyCount

`func (o *ClassificationDiagnostics) GetApplicablePolicyCount() int32`

GetApplicablePolicyCount returns the ApplicablePolicyCount field if non-nil, zero value otherwise.

### GetApplicablePolicyCountOk

`func (o *ClassificationDiagnostics) GetApplicablePolicyCountOk() (*int32, bool)`

GetApplicablePolicyCountOk returns a tuple with the ApplicablePolicyCount field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetApplicablePolicyCount

`func (o *ClassificationDiagnostics) SetApplicablePolicyCount(v int32)`

SetApplicablePolicyCount sets ApplicablePolicyCount field to given value.

### HasApplicablePolicyCount

`func (o *ClassificationDiagnostics) HasApplicablePolicyCount() bool`

HasApplicablePolicyCount returns a boolean if a field has been set.

### GetSelectedPolicyApplied

`func (o *ClassificationDiagnostics) GetSelectedPolicyApplied() bool`

GetSelectedPolicyApplied returns the SelectedPolicyApplied field if non-nil, zero value otherwise.

### GetSelectedPolicyAppliedOk

`func (o *ClassificationDiagnostics) GetSelectedPolicyAppliedOk() (*bool, bool)`

GetSelectedPolicyAppliedOk returns a tuple with the SelectedPolicyApplied field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSelectedPolicyApplied

`func (o *ClassificationDiagnostics) SetSelectedPolicyApplied(v bool)`

SetSelectedPolicyApplied sets SelectedPolicyApplied field to given value.

### HasSelectedPolicyApplied

`func (o *ClassificationDiagnostics) HasSelectedPolicyApplied() bool`

HasSelectedPolicyApplied returns a boolean if a field has been set.

### GetOutOfScopeReason

`func (o *ClassificationDiagnostics) GetOutOfScopeReason() string`

GetOutOfScopeReason returns the OutOfScopeReason field if non-nil, zero value otherwise.

### GetOutOfScopeReasonOk

`func (o *ClassificationDiagnostics) GetOutOfScopeReasonOk() (*string, bool)`

GetOutOfScopeReasonOk returns a tuple with the OutOfScopeReason field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetOutOfScopeReason

`func (o *ClassificationDiagnostics) SetOutOfScopeReason(v string)`

SetOutOfScopeReason sets OutOfScopeReason field to given value.

### HasOutOfScopeReason

`func (o *ClassificationDiagnostics) HasOutOfScopeReason() bool`

HasOutOfScopeReason returns a boolean if a field has been set.

### GetPolicyScopeSummary

`func (o *ClassificationDiagnostics) GetPolicyScopeSummary() ClassificationPolicyScopeSummary`

GetPolicyScopeSummary returns the PolicyScopeSummary field if non-nil, zero value otherwise.

### GetPolicyScopeSummaryOk

`func (o *ClassificationDiagnostics) GetPolicyScopeSummaryOk() (*ClassificationPolicyScopeSummary, bool)`

GetPolicyScopeSummaryOk returns a tuple with the PolicyScopeSummary field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetPolicyScopeSummary

`func (o *ClassificationDiagnostics) SetPolicyScopeSummary(v ClassificationPolicyScopeSummary)`

SetPolicyScopeSummary sets PolicyScopeSummary field to given value.

### HasPolicyScopeSummary

`func (o *ClassificationDiagnostics) HasPolicyScopeSummary() bool`

HasPolicyScopeSummary returns a boolean if a field has been set.

### SetPolicyScopeSummaryNil

`func (o *ClassificationDiagnostics) SetPolicyScopeSummaryNil(b bool)`

 SetPolicyScopeSummaryNil sets the value for PolicyScopeSummary to be an explicit nil

### UnsetPolicyScopeSummary
`func (o *ClassificationDiagnostics) UnsetPolicyScopeSummary()`

UnsetPolicyScopeSummary ensures that no value is present for PolicyScopeSummary, not even an explicit nil

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


