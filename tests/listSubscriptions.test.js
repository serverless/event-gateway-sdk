const SDK = require('../lib/index')
const eventGatewayProcess = require('./utils/eventGatewayProcess')

const functionConfig = {
  space: 'testspace',
  functionId: 'hello',
  provider: {
    type: 'awslambda',
    arn: 'arn::::',
    region: 'us-east-1',
  },
}

const subscriptionConfig = {
  space: 'testspace',
  subscriptionId: 'pageVisited,hello,%2F',
  functionId: 'hello',
  event: 'pageVisited',
  path: '/',
}

let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcess
    .spawn({
      configPort: 4001,
      apiPort: 4002,
      // embedPeerPort: 4003,
      // embedCliPort: 4004,
    })
    .then(processInfo => {
      eventGatewayProcessId = processInfo.id
      eventGateway = new SDK({
        space: 'testspace',
        url: `http://localhost:${processInfo.apiPort}`,
        configurationUrl: `http://localhost:${processInfo.configPort}`,
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

test('should return list of subscriptions', () => {
  expect.assertions(1)
  return eventGateway.listSubscriptions().then(response => {
    expect(response).toEqual([subscriptionConfig])
  })
})
