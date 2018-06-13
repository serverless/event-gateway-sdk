const SDK = require('../lib/index')
const eventGatewayProcess = require('./utils/eventGatewayProcess')

const eventType = {
  space: 'testspace',
  name: 'pageVisited'
}

const functionConfig = {
  space: 'testspace',
  functionId: 'hello',
  type: 'awslambda',
  provider: {
    arn: 'arn::::',
    region: 'us-east-1'
  }
}
const subscriptionConfig = {
  space: 'testspace',
  type: 'async',
  eventType: 'pageVisited',
  functionId: 'hello'
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
    }))

afterAll(() => {
  eventGatewayProcess.shutDown(eventGatewayProcessId)
})

test('should create event type', () => {
  return eventGateway.createEventType(eventType).then(response => {
    expect(response).toEqual(eventType)
  })
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
  return eventGateway.unsubscribe({ subscriptionId: 'YXN5bmMscGFnZVZpc2l0ZWQsaGVsbG8sJTJGLFBPU1Q' }).then(response => {
    expect(response).toBeUndefined()
  })
})

test('should fail to a add a subscription to a none existing function', () => {
  expect.assertions(1)
  const brokenConfig = { functionId: 'none-exiting-function', eventType: 'pageVisited' }

  return eventGateway.subscribe(brokenConfig).catch(err => {
    expect(err).toMatchSnapshot()
  })
})

test('should fail to a remove a none-existing subscription', () => {
  expect.assertions(1)
  return eventGateway.unsubscribe({ subscriptionId: 'xxx' }).catch(err => {
    expect(err).toMatchSnapshot()
  })
})
