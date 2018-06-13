# Event Gateway JavaScript SDK

JavaScript library for interacting with the [Event Gateway](https://github.com/serverless/event-gateway).

[![Build Status](https://travis-ci.org/serverless/event-gateway-sdk.svg?branch=master)](https://travis-ci.org/serverless/event-gateway-sdk)

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Constructor](#constructor)
  - [Configuration API](#configuration-api)
      - [List Functions](#list-functions)
      - [Register Function](#register-function)
      - [Update Function](#update-function)
      - [Delete Function](#delete-function)
      - [List Event Types](#list-event-types)
      - [Create Event Type](#create-event-type)
      - [Update Event Type](#update-event-type)
      - [Delete Event Type](#delete-event-type)
      - [List Subscriptions](#list-subscriptions)
      - [Subscribe](#subscribe)
      - [Unsubscribe](#unsubscribe)
  - [Events API](#events-api)
      - [Emit](#emit)

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

When using in your application logic, you'll usually interact with the `emit` APIs. Use the `emit`
command to emit a named event and payload to your Event Gateway. The event will be received by any
function that is subscribed to your event.

```javascript
// Construct your client
const SDK = require('@serverless/event-gateway-sdk');
const eventGateway = new SDK({
  url: 'http://myeventgateway.io',
  space: 'prod'
})

// Emit your event
eventGateway.emit({
  eventType: 'user.created',
  eventTypeVersion: '1.0',
  source: '/services/users',
  contentType: 'application/json',
  data: {
    userID: 123
  }
})
```

## API Reference

### Constructor

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

### Configuration API

#### List Functions

**Returns**

Promise object resolving to array of function objects

**Example**

```js
eventGateway.listFunctions()
```

For more details see Event Gateway [List Functions docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#get-functions).

#### Register Function

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
eventGateway.registerFunction({
  functionId: 'sendEmail',
  type:'awslambda',
  provider: {
    arn: 'xxx',
    region: 'us-west-2',
  }
})
```

#### Update Function

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

#### Delete Function

**Parameters**

Object:

- `functionId` - `string` - function ID

**Example**

```js
eventGateway.deleteFunction({ functionId: 'sendEmail' })
```

For more details see Event Gateway [Delete Function docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#delete-function).

#### List Event Types

**Returns**

Promise object resolving to array of event types objects

**Example**

```js
eventGateway.listEventTypes()
```

For more details see Event Gateway [List Event Types docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#get-event-types).

#### Create Event Type

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

#### Update Event Type

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

#### Delete Event Type

**Parameters**

Object:

- `name` - `string` - event type name

**Example**

```js
eventGateway.deleteEventType({ name: 'user.created' })
```

For more details see Event Gateway [Delete Event Type docs](https://github.com/serverless/event-gateway/blob/master/docs/api.md#delete-event-type).

#### List Subscriptions

**Returns**

Promise object resolving to array of subscription objects

**Example**

```js
eventGateway.listSubscriptions()
```

#### Subscribe

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

#### Unsubscribe

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

### Events API

#### Emit

**Parameters**

CloudEvents object

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
