const SDK = require('../lib/index')

describe('SDK', () => {
  describe('for standalone', () => {
    test('should create config based on URL', () => {
      const sdk = new SDK({
        url: 'localhost:4000'
      })

      expect(sdk.config.eventsUrl).toEqual('http://localhost:4000')
      expect(sdk.config.configurationUrl).toEqual('http://localhost:4001')
      expect(sdk.config.space).toEqual('default')
    })

    test('should ignore apiKey from config', () => {
      const sdk = new SDK({
        url: 'localhost:4000',
        apiKey: 'xxx'
      })

      expect(sdk.config.apiKey).toBeUndefined()
    })
  })

  describe('for hosted', () => {
    test('should create config based on URL', () => {
      const sdk = new SDK({
        url: 'test-app.slsgateway.com',
        apiKey: 'xxx'
      })

      expect(sdk.config.eventsUrl).toEqual('https://test-app.slsgateway.com')
      expect(sdk.config.configurationUrl).toEqual('https://config.slsgateway.com')
      expect(sdk.config.space).toEqual('test-app')
      expect(sdk.config.apiKey).toEqual('xxx')
    })

    test('should ignore space and config URL from config', () => {
      const sdk = new SDK({
        url: 'test-app.slsgateway.com',
        apiKey: 'xxx',
        configurationUrl: 'http://localhost:4001',
        space: 'hello'
      })

      expect(sdk.config.space).not.toEqual('hello')
      expect(sdk.config.configurationUrl).not.toEqual('http://localhost:4001')
    })
  })
})
