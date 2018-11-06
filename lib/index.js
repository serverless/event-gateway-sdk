'use strict'

const fetch = require('isomorphic-fetch')
const emit = require('./emit')
const eventTypes = require('./eventTypes')
const functions = require('./functions')
const subscriptions = require('./subscriptions')
const cors = require('./cors')
const connections = require('./connections')
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
      config.connectorUrl = config.connectorUrl
      config.accessKey = configuration.accessKey
    } else {
      config.eventsUrl = configuration.url.startsWith('http') ? configuration.url : `http://${configuration.url}`
      config.configurationUrl = configuration.configurationUrl || generateConfigUrl(config.eventsUrl)
      config.connectorUrl = config.connectorUrl
      config.space = configuration.space || 'default'
    }

    this.config = config
  }

  emit (params) {
    return emit(this.config, params)
  }

  createEventType (params) {
    return eventTypes.create(this.config, params)
  }

  updateEventType (params) {
    return eventTypes.update(this.config, params)
  }

  deleteEventType (params) {
    return eventTypes.delete(this.config, params)
  }

  listEventTypes (filters) {
    return eventTypes.list(this.config, filters)
  }

  createFunction (params) {
    return functions.create(this.config, params)
  }

  updateFunction (params) {
    return functions.update(this.config, params)
  }

  deleteFunction (params) {
    return functions.delete(this.config, params)
  }

  listFunctions (filters) {
    return functions.list(this.config, filters)
  }

  subscribe (params) {
    return subscriptions.subscribe(this.config, params)
  }
  unsubscribe (params) {
    return subscriptions.unsubscribe(this.config, params)
  }

  listSubscriptions (filters) {
    return subscriptions.list(this.config, filters)
  }

  createCORS (params) {
    return cors.create(this.config, params)
  }

  updateCORS (params) {
    return cors.update(this.config, params)
  }

  deleteCORS (params) {
    return cors.delete(this.config, params)
  }

  listCORS (filters) {
    return cors.list(this.config, filters)
  }

  createConnection (params) {
    return connections.create(this.config, params)
  }

  updateConnection (params) {
    return connections.update(this.config, params)
  }

  deleteConnection (params) {
    return connections.delete(this.config, params)
  }

  listConnections (filters) {
    return connections.list(this.config, filters)
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
