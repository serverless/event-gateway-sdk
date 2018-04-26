const SDK = require('../lib/index')
const eventGatewayProcess = require('./utils/eventGatewayProcess')

const functionConfig = {
  space: 'testspace',
  functionId: 'hello',
  type: 'awslambda',
  provider: {
    arn: 'arn::::',
    region: 'us-east-1'
  }
}
let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcess
    .spawn({
      configPort: 4001,
      apiPort: 4002
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

test('should add a function to the gateway', () => {
  expect.assertions(1)
  return eventGateway.registerFunction(functionConfig).then(response => {
    expect(response).toEqual(functionConfig)
  })
})

test('should fail to re-add the same function', () => {
  expect.assertions(1)
  return eventGateway.registerFunction(functionConfig).catch(err => {
    expect(err).toMatchSnapshot()
  })
})

test('should remove the added function', () => {
  expect.assertions(1)
  return eventGateway.deleteFunction({ functionId: 'hello' }).then(response => {
    expect(response).toBeUndefined()
  })
})

test('should fail to remove a none-existing function', () => {
  expect.assertions(1)
  return eventGateway.deleteFunction({ functionId: 'missing-func' }).catch(err => {
    expect(err).toMatchSnapshot()
  })
})
