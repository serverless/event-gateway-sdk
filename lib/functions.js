'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')

module.exports.register = (config, params) => {
  const path = `/v1/spaces/${config.space}/functions`
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
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`Failed to register the function ${params.functionId} due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to register the function ${params.functionId} and couldn't parse error body.`)
            }
          })
      }
      return response.json()
    })
}

module.exports.update = (config, params) => {
  const path = `/v1/spaces/${config.space}/functions/${params.functionId}`
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
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`Failed to update the function ${params.functionId} due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to update the function ${params.functionId} and couldn't parse error body.`)
            }
          })
      }
      return response.json()
    })
}

module.exports.delete = (config, params) => {
  const path = `/v1/spaces/${config.space}/functions/${params.functionId}`
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
              throw new Error(`Failed to delete the function ${params.functionId} due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to delete the function ${params.functionId} and couldn't parse error body.`)
            }
          })
      }
      return undefined
    })
}

module.exports.list = config => {
  const path = `/v1/spaces/${config.space}/functions`

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
              throw new Error(`Failed to fetch the function list due the error: ${errorMessage}`)
            } else {
              throw new Error("Failed to fetch the function list and couldn't parse error body.")
            }
          })
      }
      return response.json().then(res => res.functions)
    })
}
