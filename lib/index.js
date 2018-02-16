'use strict'

const isNil = require('ramda/src/isNil')
const emit = require('./emit')
const invoke = require('./invoke')
const registerFunction = require('./registerFunction')
const deleteFunction = require('./deleteFunction')
const subscribe = require('./subscribe')
const unsubscribe = require('./unsubscribe')
const urlUtils = require('./utils/url')

class EventGateway {
  constructor(configuration) {
    if (
      isNil(configuration) ||
      typeof configuration !== 'object' ||
      isNil(configuration.url) ||
      typeof configuration.url !== 'string'
    ) {
      throw new Error("Please provide an object with the property 'url' to EventGateway")
    }

    const config = {
      apiUrl: configuration.url,
      configurationUrl:
      configuration.configurationUrl || urlUtils.generateConfigureUrl(configuration.url),
      // eslint-disable-next-line global-require
      fetch: configuration.fetch || require('isomorphic-fetch'),
    }

    return {
      emit: params => emit(config, params),
      invoke: params => invoke(config, params),
      registerFunction: params => registerFunction(config, params),
      deleteFunction: params => deleteFunction(config, params),
      subscribe: params => subscribe(config, params),
      unsubscribe: params => unsubscribe(config, params),
    }
  }
}

module.exports = EventGateway
