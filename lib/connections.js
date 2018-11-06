'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')
const querystring = require('querystring')

module.exports.create = (config, params) => {
  const path = `/v1/spaces/${config.space}/connections`
  const headers = headersUtils.injectKey({ 'Content-Type': 'application/json' }, config.accessKey)

  return config
    .fetch(urlUtils.joinUrlWithPath(config.connectorUrl, path), {
      method: 'POST',
      body: JSON.stringify(params),
      headers
    })
    .then(response => {
      if (response.status !== 201) {
        let errorMessage = null
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`Failed to create the connection due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to create the connection and couldn't parse error body.`)
            }
          })
      }
      return response.json()
    })
}

module.exports.update = (config, params) => {
  const path = `/v1/spaces/${config.space}/connections/${params.connectionId}`
  const headers = headersUtils.injectKey({ 'Content-Type': 'application/json' }, config.accessKey)

  return config
    .fetch(urlUtils.joinUrlWithPath(config.connectorUrl, path), {
      method: 'PUT',
      body: JSON.stringify(params),
      headers
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
              throw new Error(`Failed to update the connection ${params.connectionId} due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to update the connection ${params.connectionId} and couldn't parse error body.`)
            }
          })
      }
      return response.json()
    })
}

module.exports.delete = (config, params) => {
  const path = `/v1/spaces/${config.space}/connections/${params.connectionId}`
  const headers = headersUtils.injectKey({}, config.accessKey)

  return config
    .fetch(urlUtils.joinUrlWithPath(config.connectorUrl, path), {
      method: 'DELETE',
      headers
    })
    .then(response => {
      if (response.status !== 204) {
        let errorMessage = null
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`Failed to delete the connection ${params.connectionId} due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to delete the connection ${params.connectionId} and couldn't parse error body.`)
            }
          })
      }
      return undefined
    })
}

module.exports.list = (config, filters) => {
  const path = `/v1/spaces/${config.space}/connections?${querystring.stringify(filters)}`

  return config
    .fetch(urlUtils.joinUrlWithPath(config.connectorUrl, path), {
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
              throw new Error(`Failed to fetch the connection list due the error: ${errorMessage}`)
            } else {
              throw new Error("Failed to fetch the connection list and couldn't parse error body.")
            }
          })
      }
      return response.json().then(res => res.connections)
    })
}
