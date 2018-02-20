const SDK = require('../lib/index')
const eventGatewayProcess = require('./utils/eventGatewayProcess')

const functionConfig = {
  space: 'testspace',
  functionId: 'subscription-test-function',
  provider: {
    type: 'awslambda',
    arn: 'arn::::',
    region: 'us-east-1'
  }
}
const subscriptionConfig = {
  space: 'testspace',
  functionId: 'subscription-test-function',
  event: 'pageVisited'
}

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
)

afterAll(() => {
  eventGatewayProcess.shutDown(eventGatewayProcessId)
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
  return eventGateway.unsubscribe({ subscriptionId: 'pageVisited,subscription-test-function,%2F' }).then(response => {
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
  return eventGateway.unsubscribe({ subscriptionId: 'pageVisited,subscription-test-function,%2F' }).catch(err => {
    expect(err).toMatchSnapshot()
  })
})
