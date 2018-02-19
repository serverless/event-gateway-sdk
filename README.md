# EventGateway-SDK

Node.js library to configuring the [Event Gateway](https://github.com/serverless/event-gateway).

[![Build Status](https://travis-ci.org/serverless/event-gateway-sdk.svg?branch=master)](https://travis-ci.org/serverless/event-gateway-sdk)

## Install (Node)

```bash
npm install @serverless/event-gateway-sdk
```

## Install (Browser)

```html
<script type="text/javascript" src="https://unpkg.com/@serverless/event-gateway-sdk@latest/dist/event-gateway-sdk.min.js"></script>
```

The EventGatewaySDK will then be attached to window e.g. and you can access it via `window.EventGatewaySDK`

## API

### Constructor

**Parameters**

Object:

- `url` - `string` - required, Events API URL
- `configurationUrl` - `string` - Configuration API URL, by default same as `url` but with `4001` port
- `space` - `string` - Space, default: `default`
 - `fetchClient` - `object` - `fetch` client

```js
const SDK = require('@serverless/event-gateway-sdk');
const eventGateway = new SDK({url: 'http://localhost' })
```

### List Functions

**Returns** array of function objects

```js
eventGateway.listFunctions()
```

### Register Function

**Parameters**

Object:

- `functionId` - `string` - function ID
- `provider` - `object` - [provider object](https://github.com/serverless/event-gateway#register-function)

**Returns**

Function object

```js
eventGateway.registerFunction({
  functionId: "sendEmail",
  provider: {
    type: "awslambda",
    arn: "xxx",
    region: "us-west-2",
  }
})
```

### Delete Function

**Parameters**

Object:

- `functionId` - `string` - function ID

```js
eventGateway.deleteFunction({ functionId: "sendEmail" })
```

### List Subscriptions

**Returns**

Array of subscription objects

```js
eventGateway.listSubscriptions()
```

### Subscribe

**Parameters**

Object:

- `event` - `string` - event type
- `functionId` - `string` - function ID

**Returns**

Subscription object

```js
eventGateway.subscribe({
  event: "user.created",
  functionId: "sendEmail"
})
```

### Unsubscribe

**Parameters**

Object:

- `subscriptionId` - `string` - subscription ID

```js
eventGateway.unsubscribe({
  subscriptionId: "user.created-sendEmail"
})
```

## Contribute

If you are interested to contribute we recommend to check out the [Contributing](https://github.com/serverless/event-gateway-sdk/blob/master/CONTRIBUTING.md) document as it explains how to get started and some of the design decisions for this library.
