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

const functionConfig = {
  space: 'default',
  functionId: 'test-emit',
  provider: {
    type: 'http',
    url: `http://localhost:${serverPort}/test/path`,
  },
}

const subscriptionConfig = {
  functionId: 'test-emit', event: 'pageVisited',
}

let eventGateway
let eventGatewayProcessId

beforeAll(done =>
  eventGatewayProcess
    .spawn({
      configPort: 4013,
      apiPort: 4014,
    })
    .then(processInfo => {
      eventGatewayProcessId = processInfo.id
      eventGateway = new SDK({
        url: `http://localhost:${processInfo.apiPort}`,
        configurationUrl: `http://localhost:${processInfo.configPort}`,
      })
      server.listen(serverPort, err => {
        if (!err) {
          done()
        }
      })
    })
)

afterAll(done => {
  eventGatewayProcess.shutDown(eventGatewayProcessId)
  server.close(() => {
    done()
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

test('should invoke the subscribed function when emitting an event', () => {
  expect.assertions(2)
  return eventGateway
    .emit({
      event: 'pageVisited',
      data: { userId: '1234' },
    })
    .then(delay(300))
    .then(response => {
      expect(requests).toHaveLength(1)
      expect(response.status).toEqual(202)
    })
})

test('should invoke the subscribed function with an event with dataType text/plain', () => {
  expect.assertions(2)
  return eventGateway
    .emit({
      event: 'pageVisited',
      data: 'This is a test text.',
      dataType: 'text/plain',
    })
    .then(delay(300))
    .then(response => {
      expect(requests).toHaveLength(2)
      expect(response.status).toEqual(202)
    })
})
