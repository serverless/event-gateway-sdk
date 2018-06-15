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

const createCORSConfig = {
  method: 'GET',
  path: '/test',
  allowedOrigins: ['http://example.com']
}

const corsConfig = {
  space: 'testspace',
  corsId: 'GET%2Ftest',
  method: 'GET',
  path: '/test',
  allowedOrigins: ['http://example.com'],
  allowedHeaders: ['Origin', 'Accept', 'Content-Type'],
  allowedMethods: ['HEAD', 'GET', 'POST'],
  allowCredentials: false
}

test('should add an event type to the gateway', () => {
  return eventGateway.createCORS(createCORSConfig).then(response => {
    expect(response).toEqual(corsConfig)
  })
})

test('should return list of CORS configurations', () => {
  return eventGateway.listCORS().then(response => {
    expect(response).toEqual([corsConfig])
  })
})

test('should fail to re-add the same CORS configuration', () => {
  return eventGateway.createCORS(createCORSConfig).catch(err => {
    expect(err).toEqual(
      new Error('Failed to create CORS configuration due the error: CORS configuration "GET%2Ftest" already exists.')
    )
  })
})

test('should remove the added CORS configuration', () => {
  return eventGateway.deleteCORS({ corsId: 'GET%2Ftest' }).then(response => {
    expect(response).toBeUndefined()
  })
})

test('should fail to remove a non-existing function', () => {
  return eventGateway.deleteCORS({ corsId: 'GET%2Ftest' }).catch(err => {
    expect(err).toEqual(
      new Error(
        'Failed to delete GET%2Ftest CORS configuration due the error: CORS configuration "GET%2Ftest" not found.'
      )
    )
  })
})
