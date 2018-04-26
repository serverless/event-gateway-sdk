# Event Gateway JavaScript SDK

JavaScript library for interacting with the [Event Gateway](https://github.com/serverless/event-gateway).

[![Build Status](https://travis-ci.org/serverless/event-gateway-sdk.svg?branch=master)](https://travis-ci.org/serverless/event-gateway-sdk)

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Constructor](#constructor)
  - [List Functions](#list-functions)
  - [Register Function](#register-function)
  - [Delete Function](#delete-function)
  - [List Subscriptions](#list-subscriptions)
  - [Subscribe](#subscribe)
  - [Unsubscribe](#unsubscribe)
  - [Emit](#emit)
  - [Invoke](#invoke)

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

## Application Usage

When using in your application logic, you'll usually interact with the `invoke` and `emit` APIs.

Use the `invoke` command to synchronously invoke backend function by name. This is similar to an RPC call.

```javascript
// Construct your client
const SDK = require('@serverless/event-gateway-sdk');
const eventGateway = new SDK({
  url: 'http://myeventgateway.io',
  space: 'prod'
})

// Call your function
eventGateway.invoke({
  functionId: 'users.getUsers',
  data: { 'limit': 100 }
}).then((resp) => resp.json())
  .then((users) => console.log(users))
```

Use the `emit` command to emit a named event and payload to your Event Gateway. The event will be received by any function that is subscribed to your event.

```javascript
// Construct your client
const SDK = require('@serverless/event-gateway-sdk');
const eventGateway = new SDK({
  url: 'http://myeventgateway.io',
  space: 'prod'
})

// Emit your event
eventGateway.emit({
  event: 'user.completedTutorial'
  data: { 'userId': 1234 }
})
```


## API Reference

### Constructor

**Parameters**

Object:

- `url` - `string` - required, Events API URL
- `configurationUrl` - `string` - Configuration API URL. By default, it's the same as `url` but with `4001` port
- `space` - `string` - Space, default: `default`
- `apiKey` - `string` - API key for hosted Event Gateway.
- `fetchClient` - `object` - `fetch` client

```js
const SDK = require('@serverless/event-gateway-sdk');
const eventGateway = new SDK({
  url: 'http://localhost',
  space: 'mycompany-prod',
  apiKey: '1234abcd'
})
```

### Configuration APIs

#### List Functions

**Returns**

Promise object resolving to array of function objects

```js
eventGateway.listFunctions()
```

#### Register Function

**Parameters**

Object:

- `functionId` - `string` - function ID
- `type` - `string` - provider type
- `provider` - `object` - provider spec

For more details see Event Gateway [Register Functions docs](https://github.com/serverless/event-gateway#register-function).

**Returns**

Promise object resolving to Function object

```js
eventGateway.registerFunction({
  functionId: 'sendEmail',
  type: 'awslambda',
  provider: {
    arn: 'xxx',
    region: 'us-west-2',
  }
})
```

#### Delete Function

**Parameters**

Object:

- `functionId` - `string` - function ID

```js
eventGateway.deleteFunction({ functionId: 'sendEmail' })
```

#### List Subscriptions

**Returns**

Promise object resolving to array of subscription objects

```js
eventGateway.listSubscriptions()
```

#### Subscribe

**Parameters**

Object:

- `event` - `string` - event type
- `functionId` - `string` - function ID
- `path` - `string` - optional, subscription path, default: `/`
- `method` - `string` - required for HTTP subscription, HTTP method
- `cors` - `object` - optional for HTTP subscriptions, CORS configuration

For more details see Event Gateway [Create Subscription docs](https://github.com/serverless/event-gateway#create-subscription).

**Returns**

Promise object resolving to Subscription object

```js
eventGateway.subscribe({
  event: 'user.created',
  functionId: 'sendEmail'
})
```

#### Unsubscribe

**Parameters**

Object:

- `subscriptionId` - `string` - subscription ID

```js
eventGateway.unsubscribe({
  subscriptionId: 'user.created-sendEmail'
})
```

### Events API

#### Emit

**Parameters**

Object:

- `event` - `string` - Name of event to emit
- `data` - `object` or `string` - Payload to include with event. If `dataType` is `"application/json"`, data will be stringified before sending.
- `dataType` - `string` - Data type of payload. Default is `"application/json"`

**Returns**

`fetch` response object.

```js
eventGateway.emit({
  event: 'user.completedTutorial'
  data: { 'userId': 1234 }
})
```

#### Invoke

**Parameters**

Object:

- `functionId` - `string` - Name of function to invoke
- `data` - `object` or `string` - Payload to include with invocation. If `dataType` is `"application/json"`, data will be stringified before sending.
- `dataType` - `string` - Data type of payload. Default is `"application/json"`

**Returns**

`fetch` response object.

```js
eventGateway.invoke({
  functionId: 'users.getUsers'
  data: { 'limit': 100 }
}).then((resp) => resp.json())
  .then((users) => console.log(users))
```

## Contribute

If you are interested to contribute we recommend to check out the [Contributing](https://github.com/serverless/event-gateway-sdk/blob/master/CONTRIBUTING.md) document as it explains how to get started and some of the design decisions for this library.
