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
  subscriptionId: 'YXN5bmMscGFnZVZpc2l0ZWQsaGVsbG8sJTJGLFBPU1Q',
  type: 'async',
  functionId: 'hello',
  eventType: 'pageVisited',
  method: 'POST',
  path: '/'
}

let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcess
    .spawn({
      configPort: 4001,
      apiPort: 4002
      // embedPeerPort: 4003,
      // embedCliPort: 4004,
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

test('should return list of subscriptions', () => {
  expect.assertions(1)
  return eventGateway.listSubscriptions().then(response => {
    expect(response).toEqual([subscriptionConfig])
  })
})
