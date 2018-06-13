'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')

module.exports.create = (config, params) => {
  const path = `/v1/spaces/${config.space}/eventtypes`
  const headers = headersUtils.injectKey({ 'Content-Type': 'application/json' }, config.accessKey)

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      method: 'POST',
      body: JSON.stringify(params),
      headers
    })
    .then(response => {
      if (response.status !== 201) {
        let errorMessage = null
        const name = params.name
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`Failed to register ${name} event type due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to register ${name} event type and couldn't parse error body.`)
            }
          })
      }
      return response.json()
    })
}

module.exports.update = (config, params) => {
  const path = `/v1/spaces/${config.space}/eventtypes/${params.name}`
  const headers = headersUtils.injectKey({ 'Content-Type': 'application/json' }, config.accessKey)

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      method: 'PUT',
      body: JSON.stringify(params),
      headers
    })
    .then(response => {
      if (response.status !== 200) {
        let errorMessage = null
        const name = params.name
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`Failed to update ${name} event type due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to update ${name} event type and couldn't parse error body.`)
            }
          })
      }
      return response.json()
    })
}

module.exports.delete = (config, params) => {
  const path = `/v1/spaces/${config.space}/eventtypes/${params.name}`
  const headers = headersUtils.injectKey({}, config.accessKey)

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
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
              throw new Error(`Failed to delete ${params.name} event type due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to delete ${params.name} event type and couldn't parse error body.`)
            }
          })
      }
      return undefined
    })
}
