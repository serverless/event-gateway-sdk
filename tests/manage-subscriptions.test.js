const SDK = require('../lib/index')
const eventGatewayProcesses = require('./event-gateway/processes')

const functionConfig = {
  functionId: 'subscription-test-function',
  provider: {
    type: 'awslambda',
    arn: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/test',
    region: 'us-east-1',
  },
}
const subscriptionConfig = { functionId: 'subscription-test-function', event: 'pageVisited' }

let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcesses
    .spawn({
      configPort: 4005,
      apiPort: 4006,
      // embedPeerPort: 4007,
      // embedCliPort: 4008,
    })
    .then(processInfo => {
      eventGatewayProcessId = processInfo.id
      eventGateway = new SDK({
        url: `http://localhost:${processInfo.apiPort}`,
        configurationUrl: `http://localhost:${processInfo.configPort}`,
      })
    })
)

afterAll(() => {
  eventGatewayProcesses.shutDown(eventGatewayProcessId)
})

test('should add a function to the gateway', () => {
  expect.assertions(1)
  return eventGateway.registerFunction(functionConfig).then(response => {
    expect(response).toEqual(functionConfig)
  })
})

test('should add a subscription to the gateway', () => {
  expect.assertions(1)
  return eventGateway.subscribe(subscriptionConfig).then(response => {
    expect(response).toMatchSnapshot()
  })
})

test('should remove the added subscription', () => {
  expect.assertions(1)
  return eventGateway
    .unsubscribe({ subscriptionId: 'pageVisited-subscription-test-function' })
    .then(response => {
      expect(response).toBeUndefined()
    })
})

test('should fail to a add a subscription to a none existing function', () => {
  expect.assertions(1)
  const brokenConfig = { functionId: 'none-exiting-function', event: 'pageVisited' }

  return eventGateway.subscribe(brokenConfig).catch(err => {
    expect(err).toMatchSnapshot()
  })
})

test('should fail to a remove a none-existing subscription', () => {
  expect.assertions(1)
  return eventGateway
    .unsubscribe({ subscriptionId: 'pageVisited-none-existing-function' })
    .catch(err => {
      expect(err).toMatchSnapshot()
    })
})
