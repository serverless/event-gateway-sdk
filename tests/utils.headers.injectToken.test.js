const headersUtils = require('../lib/utils/headers')

afterEach(() => {
  delete process.env.EVENT_GATEWAY_API_KEY
})

test('should inject the Authorization header if an API key is provided', () => {
  const apiKey = 'hjkl-5678'
  const headers = {
    'Content-Type': 'application/json'
  }
  expect(headersUtils.injectKey(headers, apiKey)).toEqual({
    'Content-Type': 'application/json',
    Authorization: 'bearer hjkl-5678'
  })
})

test('should inject the Authorization header if serverless application token is present as env variable', () => {
  process.env.EVENT_GATEWAY_API_KEY = 'wasd-1234'
  const headers = {
    'Content-Type': 'application/json'
  }
  expect(headersUtils.injectKey(headers, '')).toEqual({
    'Content-Type': 'application/json',
    Authorization: 'bearer wasd-1234'
  })
})

test('should prefer a given token over the environment variable for Authorization header if both are present', () => {
  process.env.EVENT_GATEWAY_API_KEY = 'wasd-1234'
  const apiKey = 'hjkl-5678'
  const headers = {
    'Content-Type': 'application/json'
  }
  expect(headersUtils.injectKey(headers, apiKey)).toEqual({
    'Content-Type': 'application/json',
    Authorization: 'bearer hjkl-5678'
  })
})

test('should return the same headers if serverless application token is NOT present', () => {
  const headers = {
    'Content-Type': 'application/json'
  }
  expect(headersUtils.injectKey(headers, '')).toEqual({
    'Content-Type': 'application/json'
  })
})
