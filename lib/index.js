'use strict'

const isNil = require('ramda/src/isNil')
const fetch = require('isomorphic-fetch')
const emit = require('./emit')
const invoke = require('./invoke')
const registerFunction = require('./registerFunction')
const updateFunction = require('./updateFunction')
const deleteFunction = require('./deleteFunction')
const listFunctions = require('./listFunctions')
const subscribe = require('./subscribe')
const unsubscribe = require('./unsubscribe')
const listSubscriptions = require('./listSubscriptions')
const UrlParse = require('url-parse')

class EventGateway {
  constructor (configuration) {
    if (
      isNil(configuration) ||
      typeof configuration !== 'object' ||
      isNil(configuration.url) ||
      typeof configuration.url !== 'string'
    ) {
      throw new Error('Required "url" property is missing from Event Gateway configuration')
    }

    const config = {
      fetch: configuration.fetch || fetch
    }

    if (isHosted(configuration.url)) {
      config.eventsUrl = configuration.url.startsWith('http') ? configuration.url : `https://${configuration.url}`
      config.configurationUrl = hostedGenerateConfigUrl(config.eventsUrl)
      config.space = hostedParseSpace(config.eventsUrl)
      config.accessKey = configuration.accessKey
    } else {
      config.eventsUrl = configuration.url.startsWith('http') ? configuration.url : `http://${configuration.url}`
      config.configurationUrl = configuration.configurationUrl || generateConfigUrl(config.eventsUrl)
      config.space = configuration.space || 'default'
    }

    this.config = config
  }

  emit (params) {
    return emit(this.config, params)
  }

  invoke (params) {
    return invoke(this.config, params)
  }

  registerFunction (params) {
    return registerFunction(this.config, params)
  }

  updateFunction (params) {
    return updateFunction(this.config, params)
  }

  deleteFunction (params) {
    return deleteFunction(this.config, params)
  }

  listFunctions () {
    return listFunctions(this.config)
  }

  subscribe (params) {
    return subscribe(this.config, params)
  }
  unsubscribe (params) {
    return unsubscribe(this.config, params)
  }

  listSubscriptions () {
    return listSubscriptions(this.config)
  }
}

const hostedPattern = /(.+)\.(eventgateway[a-z-]*.io|slsgateway.com)/

function isHosted (eventsUrl) {
  return hostedPattern.test(eventsUrl)
}

function hostedGenerateConfigUrl (eventsUrl) {
  const parsedUrl = new UrlParse(eventsUrl)
  const hosted = parseHostedUrl(parsedUrl.host)
  return `https://config.${hosted.host}`
}

function generateConfigUrl (eventsUrl) {
  const parsedUrl = new UrlParse(eventsUrl)
  return `${parsedUrl.protocol}//${parsedUrl.hostname}:4001`
}

function hostedParseSpace (eventsUrl) {
  const parsedUrl = new UrlParse(eventsUrl)
  return parseHostedUrl(parsedUrl.host).space
}

function parseHostedUrl (eventsHost) {
  const matches = hostedPattern.exec(eventsHost)
  if (matches !== null) {
    return {
      space: matches[1],
      host: matches[2]
    }
  }
}

module.exports = EventGateway
