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
    .then((processInfo) => {
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

const createEventTypeConfig = {
  name: 'test.event'
}

const eventTypeConfig = {
  space: 'testspace',
  name: 'test.event'
}

test('should add an event type to the gateway', () => {
  return eventGateway.createEventType(createEventTypeConfig).then((response) => {
    expect(response).toEqual(eventTypeConfig)
  })
})

test('should return list of event types', () => {
  return eventGateway.listEventTypes().then((response) => {
    expect(response).toEqual([eventTypeConfig])
  })
})

test('should return filtered list of event types', () => {
  return eventGateway.listEventTypes({ 'metadata.foo': 'bar' }).then((response) => {
    expect(response).toEqual([])
  })
})

test('should fail to re-add the same event type', () => {
  return eventGateway.createEventType(createEventTypeConfig).catch((err) => {
    expect(err).toEqual(
      new Error(
        'Failed to create test.event event type due the error: Event Type "test.event" already exists.'
      )
    )
  })
})

test('should remove the added event type', () => {
  return eventGateway.deleteEventType({ name: 'test.event' }).then((response) => {
    expect(response).toBeUndefined()
  })
})

test('should fail to remove a non-existing event type', () => {
  return eventGateway.deleteEventType({ name: 'non.existing' }).catch((err) => {
    expect(err).toEqual(
      new Error(
        'Failed to delete non.existing event type due the error: Event Type "non.existing" not found.'
      )
    )
  })
})
