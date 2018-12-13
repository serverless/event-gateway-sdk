const SDK = require('../lib/index')

describe('SDK', () => {
  describe('for standalone', () => {
    test('should create config based on URL', () => {
      const sdk = new SDK({
        url: 'localhost:4000'
      })

      expect(sdk.config.eventsUrl).toEqual('http://localhost:4000')
      expect(sdk.config.configurationUrl).toEqual('http://localhost:4001')
      expect(sdk.config.connectorUrl).toEqual('http://localhost:4002')
      expect(sdk.config.space).toEqual('default')
    })

    test('should ignore accessKey from config', () => {
      const sdk = new SDK({
        url: 'localhost:4000',
        accessKey: 'xxx'
      })

      expect(sdk.config.accessKey).toBeUndefined()
    })
  })

  describe('for hosted', () => {
    test('should create config based on URL', () => {
      const sdk = new SDK({
        url: 'test-app.slsgateway.com',
        accessKey: 'xxx'
      })

      expect(sdk.config.eventsUrl).toEqual('https://test-app.slsgateway.com')
      expect(sdk.config.configurationUrl).toEqual('https://config.slsgateway.com')
      expect(sdk.config.connectorUrl).toEqual('https://config.slsgateway.com')
      expect(sdk.config.space).toEqual('test-app')
      expect(sdk.config.accessKey).toEqual('xxx')
    })

    test('should ignore space and config URL from config', () => {
      const sdk = new SDK({
        url: 'test-app.slsgateway.com',
        accessKey: 'xxx',
        configurationUrl: 'http://localhost:4001',
        connectorUrl: 'http://localhost:4002',
        space: 'hello'
      })

      expect(sdk.config.space).not.toEqual('hello')
      expect(sdk.config.configurationUrl).not.toEqual('http://localhost:4001')
      expect(sdk.config.connectorUrl).not.toEqual('http://localhost:4002')
    })
  })
})
