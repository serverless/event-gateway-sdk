const http = require('http')
const SDK = require('../lib/index')
const eventGatewayProcess = require('./utils/eventGatewayProcess')

let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcess
    .spawn({
      configPort: 4013,
      apiPort: 4014
    })
    .then(processInfo => {
      eventGatewayProcessId = processInfo.id
      eventGateway = new SDK({
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

test('should invoke the subscribed function when emitting an event', () => {
  server.listen(serverPort)
  return eventGateway.subscribe(asyncSubscriptionConfig).then(() => {
    return eventGateway
      .emit({
        cloudEventsVersion: '0.1',
        eventType: 'test.event',
        eventID: '1',
        source: '/services/tests',
        contentType: 'application/json',
        data: {
          foo: 'bar'
        }
      })
      .then(response => {
        expect(response.status).toEqual(202)
      })
      .then(() => {
        server.close()
      })
  })
})

test('should throw an error if error response returned', () => {
  serverReturningError.listen(serverReturningErrorPort)
  return eventGateway.subscribe(syncSubscriptionConfig).then(() => {
    return eventGateway
      .emit({
        cloudEventsVersion: '0.1',
        eventType: 'test.event',
        eventID: '1',
        source: '/services/tests',
        contentType: 'application/json',
        data: {
          foo: 'bar'
        }
      })
      .catch(err => {
        expect(err).toEqual(
          new Error('Failed to emit the event test.event due the error: Function call failed. Please check logs.')
        )
      })
      .then(() => {
        serverReturningError.close()
      })
  })
})

test('should invoke the subscribed function on path when emitting an event', () => {
  server.listen(serverPort)
  return eventGateway.subscribe(syncSubscriptionWithPathConfig).then(() => {
    return eventGateway
      .emit(
        {
          cloudEventsVersion: '0.1',
          eventType: 'test.event',
          eventID: '1',
          source: '/services/tests',
          contentType: 'application/json',
          data: {
            foo: 'bar'
          }
        },
        {
          path: 'test'
        }
      )
      .then(response => {
        expect(response.status).toEqual(200)
      })
      .then(() => {
        server.close()
      })
  })
})

const serverPort = 3336
const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ statusCode: 200 }))
})
const serverReturningErrorPort = 3337
const serverReturningError = http.createServer((request, response) => {
  response.writeHead(400, { 'Content-Type': 'application/json' })
})

const eventType = {
  space: 'default',
  name: 'test.event'
}

const functionConfig = {
  space: 'default',
  functionId: 'test-emit',
  type: 'http',
  provider: {
    url: `http://localhost:${serverPort}/test/path`
  }
}

const asyncSubscriptionConfig = {
  type: 'async',
  functionId: 'test-emit',
  eventType: 'test.event'
}

const syncSubscriptionConfig = {
  type: 'sync',
  functionId: 'test-emit',
  eventType: 'test.event'
}

const syncSubscriptionWithPathConfig = {
  type: 'sync',
  functionId: 'test-emit',
  eventType: 'test.event',
  path: '/test'
}
