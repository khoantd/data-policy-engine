# WebhookCreateResponse

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**Id** | **string** |  | 
**Url** | **string** |  | 
**Events** | **[]string** |  | 
**Description** | Pointer to **NullableString** |  | [optional] 
**Active** | Pointer to **bool** |  | [optional] [default to true]
**SecretSet** | Pointer to **bool** |  | [optional] [default to false]
**CreatedAt** | **time.Time** |  | 
**UpdatedAt** | **time.Time** |  | 
**Secret** | **string** |  | 

## Methods

### NewWebhookCreateResponse

`func NewWebhookCreateResponse(id string, url string, events []string, createdAt time.Time, updatedAt time.Time, secret string, ) *WebhookCreateResponse`

NewWebhookCreateResponse instantiates a new WebhookCreateResponse object
This constructor will assign default values to properties that have it defined,
and makes sure properties required by API are set, but the set of arguments
will change when the set of required properties is changed

### NewWebhookCreateResponseWithDefaults

`func NewWebhookCreateResponseWithDefaults() *WebhookCreateResponse`

NewWebhookCreateResponseWithDefaults instantiates a new WebhookCreateResponse object
This constructor will only assign default values to properties that have it defined,
but it doesn't guarantee that properties required by API are set

### GetId

`func (o *WebhookCreateResponse) GetId() string`

GetId returns the Id field if non-nil, zero value otherwise.

### GetIdOk

`func (o *WebhookCreateResponse) GetIdOk() (*string, bool)`

GetIdOk returns a tuple with the Id field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetId

`func (o *WebhookCreateResponse) SetId(v string)`

SetId sets Id field to given value.


### GetUrl

`func (o *WebhookCreateResponse) GetUrl() string`

GetUrl returns the Url field if non-nil, zero value otherwise.

### GetUrlOk

`func (o *WebhookCreateResponse) GetUrlOk() (*string, bool)`

GetUrlOk returns a tuple with the Url field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUrl

`func (o *WebhookCreateResponse) SetUrl(v string)`

SetUrl sets Url field to given value.


### GetEvents

`func (o *WebhookCreateResponse) GetEvents() []string`

GetEvents returns the Events field if non-nil, zero value otherwise.

### GetEventsOk

`func (o *WebhookCreateResponse) GetEventsOk() (*[]string, bool)`

GetEventsOk returns a tuple with the Events field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetEvents

`func (o *WebhookCreateResponse) SetEvents(v []string)`

SetEvents sets Events field to given value.


### GetDescription

`func (o *WebhookCreateResponse) GetDescription() string`

GetDescription returns the Description field if non-nil, zero value otherwise.

### GetDescriptionOk

`func (o *WebhookCreateResponse) GetDescriptionOk() (*string, bool)`

GetDescriptionOk returns a tuple with the Description field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetDescription

`func (o *WebhookCreateResponse) SetDescription(v string)`

SetDescription sets Description field to given value.

### HasDescription

`func (o *WebhookCreateResponse) HasDescription() bool`

HasDescription returns a boolean if a field has been set.

### SetDescriptionNil

`func (o *WebhookCreateResponse) SetDescriptionNil(b bool)`

 SetDescriptionNil sets the value for Description to be an explicit nil

### UnsetDescription
`func (o *WebhookCreateResponse) UnsetDescription()`

UnsetDescription ensures that no value is present for Description, not even an explicit nil
### GetActive

`func (o *WebhookCreateResponse) GetActive() bool`

GetActive returns the Active field if non-nil, zero value otherwise.

### GetActiveOk

`func (o *WebhookCreateResponse) GetActiveOk() (*bool, bool)`

GetActiveOk returns a tuple with the Active field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetActive

`func (o *WebhookCreateResponse) SetActive(v bool)`

SetActive sets Active field to given value.

### HasActive

`func (o *WebhookCreateResponse) HasActive() bool`

HasActive returns a boolean if a field has been set.

### GetSecretSet

`func (o *WebhookCreateResponse) GetSecretSet() bool`

GetSecretSet returns the SecretSet field if non-nil, zero value otherwise.

### GetSecretSetOk

`func (o *WebhookCreateResponse) GetSecretSetOk() (*bool, bool)`

GetSecretSetOk returns a tuple with the SecretSet field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSecretSet

`func (o *WebhookCreateResponse) SetSecretSet(v bool)`

SetSecretSet sets SecretSet field to given value.

### HasSecretSet

`func (o *WebhookCreateResponse) HasSecretSet() bool`

HasSecretSet returns a boolean if a field has been set.

### GetCreatedAt

`func (o *WebhookCreateResponse) GetCreatedAt() time.Time`

GetCreatedAt returns the CreatedAt field if non-nil, zero value otherwise.

### GetCreatedAtOk

`func (o *WebhookCreateResponse) GetCreatedAtOk() (*time.Time, bool)`

GetCreatedAtOk returns a tuple with the CreatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetCreatedAt

`func (o *WebhookCreateResponse) SetCreatedAt(v time.Time)`

SetCreatedAt sets CreatedAt field to given value.


### GetUpdatedAt

`func (o *WebhookCreateResponse) GetUpdatedAt() time.Time`

GetUpdatedAt returns the UpdatedAt field if non-nil, zero value otherwise.

### GetUpdatedAtOk

`func (o *WebhookCreateResponse) GetUpdatedAtOk() (*time.Time, bool)`

GetUpdatedAtOk returns a tuple with the UpdatedAt field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetUpdatedAt

`func (o *WebhookCreateResponse) SetUpdatedAt(v time.Time)`

SetUpdatedAt sets UpdatedAt field to given value.


### GetSecret

`func (o *WebhookCreateResponse) GetSecret() string`

GetSecret returns the Secret field if non-nil, zero value otherwise.

### GetSecretOk

`func (o *WebhookCreateResponse) GetSecretOk() (*string, bool)`

GetSecretOk returns a tuple with the Secret field if it's non-nil, zero value otherwise
and a boolean to check if the value has been set.

### SetSecret

`func (o *WebhookCreateResponse) SetSecret(v string)`

SetSecret sets Secret field to given value.



[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


