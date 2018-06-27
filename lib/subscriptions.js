'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')
const querystring = require('querystring')

module.exports.subscribe = (config, params) => {
  const path = `/v1/spaces/${config.space}/subscriptions`

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      method: 'POST',
      body: JSON.stringify(params),
      headers: headersUtils.injectKey({ 'Content-Type': 'application/json' }, config.accessKey)
    })
    .then(response => {
      if (response.status !== 201) {
        let errorMessage = null
        const tmpMsg = `Failed to subscribe the event ${params.eventType}`
        const errorStart = `${tmpMsg} to the function ${params.functionId}`
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`${errorStart} due the error: ${errorMessage}`)
            } else {
              throw new Error(`${errorStart} and couldn't parse error body.`)
            }
          })
      }
      return response.json()
    })
}

module.exports.unsubscribe = (config, params) => {
  const path = `/v1/spaces/${config.space}/subscriptions/${params.subscriptionId}`

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      method: 'DELETE',
      headers: headersUtils.injectKey({}, config.accessKey)
    })
    .then(response => {
      if (response.status !== 204) {
        let errorMessage = null
        const errorStart = `Failed to unsubscribe the subscription ${params.subscriptionId}`
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`${errorStart} due the error: ${errorMessage}`)
            } else {
              throw new Error(`${errorStart} and couldn't parse error body.`)
            }
          })
      }
      return undefined
    })
}

module.exports.list = (config, filters) => {
  const path = `/v1/spaces/${config.space}/subscriptions?${querystring.stringify(filters)}`

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      headers: headersUtils.injectKey({}, config.accessKey)
    })
    .then(response => {
      if (response.status !== 200) {
        let errorMessage = null
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`Failed to fetch the subscriptions list due the error: ${errorMessage}`)
            } else {
              throw new Error("Failed to fetch the subscriptions list and couldn't parse error body.")
            }
          })
      }
      return response.json().then(res => res.subscriptions)
    })
}
