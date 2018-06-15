const SDK = require('../lib/index')
const eventGatewayProcess = require('./utils/eventGatewayProcess')

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

const createFunctionConfig = {
  functionId: 'test',
  type: 'awslambda',
  provider: {
    arn: 'arn::::',
    region: 'us-east-1'
  }
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

test('should add a function to the gateway', () => {
  return eventGateway.createFunction(createFunctionConfig).then(response => {
    expect(response).toEqual(functionConfig)
  })
})

test('should return list of functions', () => {
  return eventGateway.listFunctions().then(response => {
    expect(response).toEqual([functionConfig])
  })
})

test('should fail to re-add the same function', () => {
  return eventGateway.createFunction(functionConfig).catch(err => {
    expect(err).toEqual(
      new Error('Failed to create the function test due the error: Function "test" already registered.')
    )
  })
})

test('should update an existing function', () => {
  const updateFunctionConfig = {
    functionId: 'test',
    type: 'awslambda',
    provider: {
      arn: 'arn::::',
      region: 'us-west-1'
    }
  }

  const updatedFunctionConfig = {
    space: 'testspace',
    functionId: 'test',
    type: 'awslambda',
    provider: {
      arn: 'arn::::',
      region: 'us-west-1'
    }
  }

  return eventGateway.updateFunction(updateFunctionConfig).then(response => {
    expect(response).toEqual(updatedFunctionConfig)
  })
})

test('should remove the added function', () => {
  return eventGateway.deleteFunction({ functionId: 'test' }).then(response => {
    expect(response).toBeUndefined()
  })
})

test('should fail to remove a non-existing function', () => {
  return eventGateway.deleteFunction({ functionId: 'missing-func' }).catch(err => {
    expect(err).toEqual(
      new Error('Failed to delete the function missing-func due the error: Function "missing-func" not found.')
    )
  })
})
