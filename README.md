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

## Create an Event Gateway Client

```js
const SDK = require('@serverless/event-gateway-sdk');
const eventGateway = new SDK({
  url: 'http://localhost',
})
```

Optional Properties for `eventGateway`

```js
{
  // defaults to the provide URL + default config port 4001
  configurationUrl: 'http://localhost:4001'
  // optional property to provide their own http lib
  fetchClient: fetch
}
```

## API

### Register Function

**Returns** function object

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

```js
eventGateway.deleteFunction({ functionId: "sendEmail" })
```

### Subscribe

**Returns** subscription object

```js
eventGateway.subscribe({
  event: "user.created",
  functionId: "sendEmail"
})
```

### Unsubscribe

```js
eventGateway.unsubscribe({
  subscriptionId: "user.created-sendEmail"
})
```

## Contribute

If you are interested to contribute we recommend to check out the [Contributing](https://github.com/serverless/event-gateway-sdk/blob/master/CONTRIBUTING.md) document as it explains how to get started and some of the design decisions for this library.
