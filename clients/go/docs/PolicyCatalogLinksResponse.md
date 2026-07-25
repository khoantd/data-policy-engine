# PolicyCatalogLinksResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Systems** | Pointer to [**[]CatalogLinkSystemRef**](CatalogLinkSystemRef.md) |  | [optional] 
**Processes** | Pointer to [**[]CatalogLinkProcessRef**](CatalogLinkProcessRef.md) |  | [optional] 

## Methods

### NewPolicyCatalogLinksResponse

`func NewPolicyCatalogLinksResponse() *PolicyCatalogLinksResponse`

NewPolicyCatalogLinksResponse instantiates a new PolicyCatalogLinksResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewPolicyCatalogLinksResponseWithDefaults

`func NewPolicyCatalogLinksResponseWithDefaults() *PolicyCatalogLinksResponse`

NewPolicyCatalogLinksResponseWithDefaults instantiates a new PolicyCatalogLinksResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetSystems

`func (o *PolicyCatalogLinksResponse) GetSystems() []CatalogLinkSystemRef`

GetSystems returns the Systems field if non-nil, zero value otherwise.

### GetSystemsOk

`func (o *PolicyCatalogLinksResponse) GetSystemsOk() (*[]CatalogLinkSystemRef, bool)`

GetSystemsOk returns a tuple with the Systems field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSystems

`func (o *PolicyCatalogLinksResponse) SetSystems(v []CatalogLinkSystemRef)`

SetSystems sets Systems field to given value.

### HasSystems

`func (o *PolicyCatalogLinksResponse) HasSystems() bool`

HasSystems returns a boolean if a field has been set.

### GetProcesses

`func (o *PolicyCatalogLinksResponse) GetProcesses() []CatalogLinkProcessRef`

GetProcesses returns the Processes field if non-nil, zero value otherwise.

### GetProcessesOk

`func (o *PolicyCatalogLinksResponse) GetProcessesOk() (*[]CatalogLinkProcessRef, bool)`

GetProcessesOk returns a tuple with the Processes field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetProcesses

`func (o *PolicyCatalogLinksResponse) SetProcesses(v []CatalogLinkProcessRef)`

SetProcesses sets Processes field to given value.

### HasProcesses

`func (o *PolicyCatalogLinksResponse) HasProcesses() bool`

HasProcesses returns a boolean if a field has been set.


[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


