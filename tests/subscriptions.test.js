const SDK = require('../lib/index')
const eventGatewayProcess = require('./utils/eventGatewayProcess')

let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcess
    .spawn({
      configPort: 4005,
      apiPort: 4006
    })
    .then(processInfo => {
      eventGatewayProcessId = processInfo.id
      eventGateway = new SDK({
        space: 'testspace',
        url: `http://localhost:${processInfo.apiPort}`,
        configurationUrl: `http://localhost:${processInfo.configPort}`
      })
    })
    .then(() => {
      return eventGateway.createEventType(eventType)
    })
    .then(() => {
      return eventGateway.createFunction(functionConfig)
    }))

afterAll(() => {
  eventGatewayProcess.shutDown(eventGatewayProcessId)
})

test('should add a subscription to the gateway', () => {
  return eventGateway.subscribe(createSubscriptionConfig).then(response => {
    expect(response).toEqual(createdSubscriptionConfig)
  })
})

test('should return list of subscriptions', () => {
  return eventGateway.listSubscriptions().then(response => {
    expect(response).toEqual([createdSubscriptionConfig])
  })
})

test('should remove the added subscription', () => {
  return eventGateway.unsubscribe({ subscriptionId: 'YXN5bmMsdGVzdC5ldmVudCx0ZXN0LCUyRixQT1NU' }).then(response => {
    expect(response).toBeUndefined()
  })
})

test('should fail to a add a subscription to a none existing function', () => {
  const brokenConfig = { functionId: 'none-exiting-function', eventType: 'pageVisited' }

  return eventGateway.subscribe(brokenConfig).catch(err => {
    expect(err).toEqual(
      new Error(
        `Failed to subscribe the event undefined to the function none-exiting-function due the error: ` +
          `Subscription doesn't validate. Validation error: Key: 'Subscription.Type' Error:Field validation` +
          ` for 'Type' failed on the 'required' tag`
      )
    )
  })
})

test('should fail to a remove a non-existing subscription', () => {
  return eventGateway.unsubscribe({ subscriptionId: 'xxx' }).catch(err => {
    expect(err).toEqual(
      new Error('Failed to unsubscribe the subscription xxx due the error: Subscription "xxx" not found.')
    )
  })
})

const eventType = {
  space: 'testspace',
  name: 'test.event'
}

const functionConfig = {
  space: 'testspace',
  functionId: 'test',
  type: 'awslambda',
  provider: {
    arn: 'arn::::',
    region: 'us-east-1'
  }
}
const createSubscriptionConfig = {
  type: 'async',
  eventType: 'test.event',
  functionId: 'test'
}

const createdSubscriptionConfig = {
  space: 'testspace',
  subscriptionId: 'YXN5bmMsdGVzdC5ldmVudCx0ZXN0LCUyRixQT1NU',
  type: 'async',
  eventType: 'test.event',
  functionId: 'test',
  method: 'POST',
  path: '/'
}
