# EventGateway-SDK

Node.js library to to configure configure the [Event Gateway](https://github.com/serverless/event-gateway).

[![Build Status](https://travis-ci.org/serverless/fdk.svg?branch=master)](https://travis-ci.org/serverless/fdk)

## Install (Node)

```bash
npm install @serverless/event-gateway-sdk
```

## Install (Browser)

```html
<script type="text/javascript" src="https://unpkg.com/@serverless/event-gateway-sdk@latest/dist/event-gateway-sdk.min.js"></script>
```

The FDK then will be attached to window e.g. and you can access it via `window.fdk`

## Create an Event Gateway Client

```js
const egSDK = require('@serverless/event-gateway-sdk');
const eventGateway = new egSDK({
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

## Configure an Event Gateway

Configure accepts an object of function and subscription definitions. The idea of exposing one configuration function is to provide developers with convenient utility to configure an Event Gateway in one call rather then dealing with a chain of Promise based calls. Nevertheless in addition we expose a wrapper function for each low-level API call to the Event Gateway described in this [section](#further-event-gateway-functions).

```js
eventGateway.configure({
  // list of all the functions that should be registered
  functions: [
    {
      functionId: "helloWorld",
      provider: {
        type: "awslambda",
        arn: "xxx",
        region: "us-west-2",
      }
    },
    {
      functionId: "sendWelcomeMail",
      provider: {
        type: "gcloudfunction",
        name: "sendWelcomeEmail",
        region: "us-west-2",
      }
    }
  ],
  // list of all the subscriptions that should be created
  subscriptions: [
    {
      event: "http",
      method: "GET",
      path: "/users",
      functionId: "helloWorld"
    },
    {
      event: "user.created",
      functionId: "sendEmail"
    }
  ]
})
```

Returns a promise which contains all the same list of functions and subscriptions in the same structure and order as provided in the configuration argument.

```js
eventGateway.configure({ config })
  .then((response) => {
    console.log(response)
    // {
    //   functions: [
    //     { functionId: 'xxx', … },
    //     { functionId: 'xxx', … }
    //   ],
    //   subscriptions: [
    //     { subscriptionId: 'xxx', … },
    //     { subscriptionId: 'xxx', … }
    //   ]
    // }
  })
```

## Reset the configuration

Reset removes all the existing subscriptions and functions.

```js
eventGateway.resetConfiguration()
```

## Further Event Gateway Functions

```js
// Returns a function
eventGateway.registerFunction({
  functionId: "sendEmail",
  provider: {
    type: "awslambda",
    arn: "xxx",
    region: "us-west-2",
  }
})

// Returns undefined
eventGateway.deleteFunction({ functionId: "sendEmail" })

// Returns a subscription: { subscriptionId, event, functionId}
eventGateway.subscribe({
  event: "user.created",
  functionId: "sendEmail"
})

// Returns undefined
eventGateway.unsubscribe({
  subscriptionId: "user.created-sendEmail"
})
```

## Contribute

If you are interested to contribute we recommend to check out the [Contributing](https://github.com/serverless/fdk/blob/master/CONTRIBUTING.md) document as it explains how to get started and some of the design decisions for this library.
