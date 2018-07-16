# Event Gateway JavaScript SDK

Javascript library for interacting with the [Event Gateway](https://github.com/serverless/event-gateway).

[![Build Status](https://travis-ci.org/serverless/event-gateway-sdk.svg?branch=master)](https://travis-ci.org/serverless/event-gateway-sdk)

## Contents

- [Background](#background)
- [Target Audience](#target-audience)
- [Installation](#installation)
- [Usage](#usage)
- [Constructor](#constructor)
- [API Reference](#api-reference)
- [Contributing](#contributing)

## Background

This is the Javascript SDK for interacting with the [Event Gateway](https://github.com/serverless/event-gateway), the hub for connecting events to serverless functions. It is designed to work both on the server with Node.js and in the browser.

## Target Audience

This SDK can be used both to *configure* the Event Gateway, by registering functions and subscriptions, and to *interact* with the Event Gateway, by emitting events from your application to be sent to subscribed functions.

This README is focused on the latter use case -- interacting with the Event Gateway by emitting events. If you're interested in using the Event Gateway SDK to configure the Event Gateway, please check the [API reference](./docs/api.md) for the available methods, as well as the main [Event Gateway repository](https://github.com/serverless/event-gateway). You may also be interested in using the [Event Gateway plugin](https://github.com/serverless/serverless-event-gateway-plugin) for the [Serverless Framework](https://github.com/serverless/serverless) to configure the Event Gateway.

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

## Usage

Use the `emit` command to emit a named event and payload to your Event Gateway. The event will be received by any function that is subscribed to your event.

```javascript
// Construct your client
const SDK = require('@serverless/event-gateway-sdk');
const eventGateway = new SDK({
  url: 'https://mytenant-myapp.slsgateway.com',
})

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

The method returns a [`fetch`](https://github.com/bitinn/node-fetch) response object. If your event has a `sync` subscription attached, the `fetch` response will have the status code and body from the subscription. If not, the response will return a `202 Accepted` status code with an empty body.

## Constructor

In the example above, we created an Event Gateway client using the application URL from the [hosted Event Gateway](https://dashboard.serverless.com/) provided by Serverless, Inc. 

You can also use the Event Gateway SDK with your own, self-hosted Event Gateway. Constructor details are listed below.

**Parameters**

Object:

- `url` - `string` - required, Events API URL
- `configurationUrl` - `string` -  optional, Configuration API URL. By default, it's the same as `url` but with `4001` port
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

## API Reference

For all available methods in the Event Gateway SDK, please see the [API reference](./docs/api.md).

## Contribute

If you are interested to contribute we recommend to check out the [Contributing](https://github.com/serverless/event-gateway-sdk/blob/master/CONTRIBUTING.md) document as it explains how to get started and some of the design decisions for this library.
