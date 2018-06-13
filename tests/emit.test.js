const http = require('http')
const SDK = require('../lib/index')
const eventGatewayProcess = require('./utils/eventGatewayProcess')
const delay = require('./utils/delay')

const requests = []
const serverPort = 3336
const server = http.createServer((request, response) => {
  requests.push(request)
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ message: 'success' }))
})

const eventType = {
  space: 'default',
  name: 'pageVisited'
}

const functionConfig = {
  space: 'default',
  functionId: 'test-emit',
  type: 'http',
  provider: {
    url: `http://localhost:${serverPort}/test/path`
  }
}

const subscriptionConfig = {
  type: 'async',
  functionId: 'test-emit',
  eventType: 'pageVisited'
}

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
      server.listen(serverPort)
    })
    .then(() => {
      return eventGateway.createEventType(eventType)
    })
    .then(() => {
      return eventGateway.registerFunction(functionConfig)
    })
    .then(() => {
      return eventGateway.subscribe(subscriptionConfig)
    }))

afterAll(done => {
  eventGatewayProcess.shutDown(eventGatewayProcessId)
  server.close(() => {
    done()
  })
})

test('should invoke the subscribed function when emitting an event', () => {
  return eventGateway
    .emit({
      event: 'pageVisited',
      data: { userId: '1234' }
    })
    .then(delay(300))
    .then(response => {
      expect(requests).toHaveLength(1)
      expect(response.status).toEqual(202)
    })
})
