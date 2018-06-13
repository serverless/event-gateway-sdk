'use strict'

const fetch = require('isomorphic-fetch')
const emit = require('./emit')
const eventType = require('./eventTypes')
const functions = require('./functions')
const subscriptions = require('./subscriptions')
const UrlParse = require('url-parse')

class EventGateway {
  constructor (configuration) {
    if (
      configuration == null ||
      typeof configuration !== 'object' ||
      configuration.url == null ||
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

  createEventType (params) {
    return eventType.create(this.config, params)
  }

  updateEventType (params) {
    return eventType.update(this.config, params)
  }

  deleteEventType (params) {
    return eventType.delete(this.config, params)
  }

  registerFunction (params) {
    return functions.register(this.config, params)
  }

  updateFunction (params) {
    return functions.update(this.config, params)
  }

  deleteFunction (params) {
    return functions.delete(this.config, params)
  }

  listFunctions () {
    return functions.list(this.config)
  }

  subscribe (params) {
    return subscriptions.subscribe(this.config, params)
  }
  unsubscribe (params) {
    return subscriptions.unsubscribe(this.config, params)
  }

  listSubscriptions () {
    return subscriptions.list(this.config)
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
