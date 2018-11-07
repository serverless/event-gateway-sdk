# API Reference

- [Installation](#installation)
- [Constructor](#constructor)
- [Configuration API](#configuration-api)
  - Functions:
    - [`listFunctions`](#listfunctions)
    - [`createFunction`](#createfunction)
    - [`updateFunction`](#updatefunction)
    - [`deleteFunction`](#deletefunction)
  - Event Types:
	  - [`listEventTypes`](#listeventtypes)
	  - [`createEventType`](#createeventtype)
	  - [`updateEventType`](#updateeventtype)
	  - [`deleteEventType`](#deleteeventtype)
	- Subscriptions:
	  - [`listSubscriptions`](#listsubscriptions)
	  - [`subscribe`](#subscribe)
	  - [`unsubscribe`](#unsubscribe)
	- CORS:
	  - [`listCORS`](#listcors)
	  - [`createCORS`](#createcors)
	  - [`updateCORS`](#updatecors)
	  - [`deleteCORS`](#deletecors)
  - [Experimental] Connections:
	  - [`listConnections`](#listconnections)
	  - [`createConnection`](#createconnection)
	  - [`updateConnection`](#updateconnection)
	  - [`deleteConnection`](#deleteconnection)
- [Events API](#events-api)
  - [`emit`](#emit)

## Installation

Node:

```bash
npm install @serverless/event-gateway-sdk
```

Browser:

```html
<script type="text/javascript" src="https://unpkg.com/@serverless/event-gateway-sdk@latest/dist/event-gateway-sdk.min.js"></script>
```

The EventGateway SDK will then be attached to window e.g. and you can access it via `window.EventGatewaySDK`

## Constructor

**Parameters**

Object:

- `url` - `string` - required, Events API URL
- `configurationUrl` - `string` -  optional, Configuration API URL. By default, it's the same as `url` but with `4001` port
- `connectorUrl` - `string` -  optional, Connector Configuration API URL. Default: `http://localhost:4002`
- `space` - `string` - optional, space name, default: `default`
- `accessKey` - `string` - optional, access key for hosted Event Gateway. Access key is required for using Configuration API methods on hosted Event Gateway
- `fetchClient` - `object` - optional, `fetch` client

**Example**

```js
const SDK = require('@serverless/event-gateway-sdk');
const eventGateway = new SDK({
  url: 'http://localhost',
  space: 'mycompany-prod',
  accessKey: '1234abcd'
})
```

## Configuration API

#### `listFunctions`

**Parameters**

Optional, `object` with filters

For more details see Event Gateway [List Functions docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#list-functions).

**Returns**

Promise object resolving to array of function objects

**Example**

```js
eventGateway.listFunctions()
```

---

#### `createFunction`

**Parameters**

Object:

- `functionId` - `string` - function ID
- `type` - `string` - type of function provider
- `provider` - `object` - provider spec

For more details see Event Gateway [Register Function docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#register-function).

**Returns**

Promise object resolving to Function object

**Example**

```js
eventGateway.createFunction({
  functionId: 'sendEmail',
  type:'awslambda',
  provider: {
    arn: 'xxx',
    region: 'us-west-2',
  }
})
```

---

#### `updateFunction`

**Parameters**

Object:

- `functionId` - `string` - function ID
- `type` - `string` - type of function provider
- `provider` - `object` - provider spec

For more details see Event Gateway [Update Function docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#update-function).

**Returns**

Promise object resolving to Function object

**Example**

```js
eventGateway.updateFunction({
  functionId: 'sendEmail',
  type:'awslambda',
  provider: {
    arn: 'xxx',
    region: 'us-west-2',
  }
})
```

---

#### `deleteFunction`

**Parameters**

Object:

- `functionId` - `string` - function ID

**Example**

```js
eventGateway.deleteFunction({ functionId: 'sendEmail' })
```

For more details see Event Gateway [Delete Function docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#delete-function).

---

#### `listEventTypes`

**Parameters**

Optional, `object` with filters

For more details see Event Gateway [List Event Types docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#list-event-types).

**Returns**

Promise object resolving to array of event types objects

**Example**

```js
eventGateway.listEventTypes()
```

---

#### `createEventType`

**Parameters**

Object:

- `name` - `string` - event type name
- `authorizerId` - `string` - optional, ID of event type authorizer

For more details see Event Gateway [Create Event Type docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#create-event-type).

**Returns**

Promise object resolving to Event Type object

**Example**

```js
eventGateway.createEventType({
  name: 'user.created'
})
```

---

#### `updateEventType`

**Parameters**

Object:

- `name` - `string` - event type name
- `authorizerId` - `string` - optional, ID of event type authorizer

For more details see Event Gateway [Update Event Type docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#update-event-type).

**Returns**

Promise object resolving to Event Type object

**Example**

```js
eventGateway.updateEventType({
  name: 'user.created',
  authorizerId: 'userAuthorizer'
})
```

---

#### `deleteEventType`

**Parameters**

Object:

- `name` - `string` - event type name

**Example**

```js
eventGateway.deleteEventType({ name: 'user.created' })
```

For more details see Event Gateway [Delete Event Type docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#delete-event-type).

---

#### `listSubscriptions`

**Parameters**

Optional, `object` with filters

For more details see Event Gateway [List Subscriptions docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#list-subscriptions).

**Returns**

Promise object resolving to array of subscription objects

**Example**

```js
eventGateway.listSubscriptions()
```

---

#### `subscribe`

**Parameters**

Object:

- `type` - `string` - subscription type, `async` or `sync`
- `eventType` - `string` - event type
- `functionId` - `string` - function ID
- `path` - `string` - optional, subscription path, default: `/`
- `method` - `string` - optional, HTTP method, default: `POST`

For more details see Event Gateway [Create Subscription docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#create-subscription).

**Returns**

Promise object resolving to Subscription object

**Example**

```js
eventGateway.subscribe({
  event: 'user.created',
  functionId: 'sendEmail'
})
```

---

#### `unsubscribe`

**Parameters**

Object:

- `subscriptionId` - `string` - subscription ID

**Example**

```js
eventGateway.unsubscribe({
  subscriptionId: 'dXNlci5jcmVhdGVkLXNlbmRFbWFpbA'
})
```

For more details see Event Gateway [Delete Subscription docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#delete-subscription).

---

#### `listCORS`

**Parameters**

Optional, `object` with filters

For more details see Event Gateway [List CORS Configurations docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#list-cors-configurations).

**Returns**

Promise object resolving to array of CORS configuration objects

**Example**

```js
eventGateway.listCORS()
```

---

#### `createCORS`

**Parameters**

Object:

- `method` - `string` - endpoint method
- `path` - `string` - endpoint path
- `allowedOrigins` - `array` of `string` - list of allowed origins. An origin may contain a wildcard (\*) to replace 0 or more characters (i.e.: http://\*.domain.com), default: `*`
- `allowedMethods` - `array` of `string` - list of allowed methods, default: `HEAD`, `GET`, `POST`
- `allowedHeaders` - `array` of `string` - list of allowed headers, default: `Origin`, `Accept`, `Content-Type`
- `allowCredentials` - `bool` - allow credentials, default: false

For more details see Event Gateway [Create CORS Configuration docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#create-cors-configuration).

**Returns**

Promise object resolving to CORS configuration object

**Example**

```js
eventGateway.createCORS({
  method: 'GET',
  path: '/hello',
  allowedOrigins: ['http://example.com']
})
```

---

#### `updateCORS`

**Parameters**

Object:

- `corsId` - `string` - CORS configuration ID
- `method` - `string` - endpoint method
- `path` - `string` - endpoint path
- `allowedOrigins` - `array` of `string` - list of allowed origins. An origin may contain a wildcard (\*) to replace 0 or more characters (i.e.: http://\*.domain.com), default: `*`
- `allowedMethods` - `array` of `string` - list of allowed methods, default: `HEAD`, `GET`, `POST`
- `allowedHeaders` - `array` of `string` - list of allowed headers, default: `Origin`, `Accept`, `Content-Type`
- `allowCredentials` - `bool` - allow credentials, default: false

For more details see Event Gateway [Update CORS Configuration docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#update-cors-configuration).

**Returns**

Promise object resolving to CORS configuration object

**Example**

```js
eventGateway.updateCORS({
  method: 'GET',
  path: '/hello',
  allowedOrigins: ['http://example.com']
})
```

---

#### `deleteCORS`

**Parameters**

Object:

- `corsID` - `string` - CORS configuration ID

**Example**

```js
eventGateway.deleteCORS({ corsId: 'GET%2Fhello' })
```

For more details see Event Gateway [Delete CORS Configuration docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#delete-cors-configuration).

---

#### `listConnections`

For more details see Event Gateway Connector [List Connections docs](https://github.com/serverless/event-gateway-connector#list-connections)

**Example**

```js
eventGateway.listConnections()
```

---

#### `createConnection`

For more details see Event Gateway Connector [Create Connection docs](https://github.com/serverless/event-gateway-connector#create-connection)

**Example**

```js
eventGateway.createConnection({
	target: "http://localhost:4001",
	eventType: "user.created",
	type: "awskinesis",
	source: {
		streamName: "test",
		region: "us-east-1"
	}
})
```

---

#### `updateConnection`

For more details see Event Gateway Connector [Update Connection docs](https://github.com/serverless/event-gateway-connector#update-connection)

**Example**

```js
eventGateway.updateConnection({
  connectionId: "xxx",
	target: "http://localhost:4001",
	eventType: "user.created",
	type: "awskinesis",
	source: {
		streamName: "test",
		region: "us-east-1"
	}
})
```

---

#### `deleteConnection`

For more details see Event Gateway Connector [Delete Connection docs](https://github.com/serverless/event-gateway-connector#delete-connection)

**Example**

```js
eventGateway.deleteConnection({ connectionId: 'xxx' })
```

### Events API

#### `emit`

**Parameters**

* `event` - `object` - A [CloudEvents](https://github.com/cloudevents/spec) event payload.
* `options` - `object` - optional, with following parameters:
  * `path` - `string` - The path on which the event will be emitted. Default is `/`.
  * `headers` - `object` - Additional headers to pass with the event request. Can include Authorization headers, etc.

**Returns**

`fetch` response object.

**Example**

```js
// Emit your event
eventGateway.emit({
  eventID: '1',
  eventType: 'user.created',
  cloudEventsVersion: '0.1',
  source: '/services/users',
  contentType: 'application/json',
  data: {
    userID: 'foo'
  }
})
```

## Contribute

If you are interested to contribute we recommend to check out the [Contributing](https://github.com/serverless/event-gateway-sdk/blob/master/CONTRIBUTING.md) document as it explains how to get started and some of the design decisions for this library.
