const headersUtils = require('../lib/utils/headers')

afterEach(() => {
  delete process.env.EVENT_GATEWAY_TOKEN
})

test('should inject the Authorization header if serverless application token is present', () => {
  process.env.EVENT_GATEWAY_TOKEN = 'wasd-1234'
  const headers = {
    'Content-Type': 'application/json',
  }
  expect(headersUtils.injectToken(headers)).toEqual({
    'Content-Type': 'application/json',
    Authorization: 'bearer wasd-1234',
  })
})

test('should return the same headers if serverless application token is NOT present', () => {
  const headers = {
    'Content-Type': 'application/json',
  }
  expect(headersUtils.injectToken(headers)).toEqual({
    'Content-Type': 'application/json',
  })
})
