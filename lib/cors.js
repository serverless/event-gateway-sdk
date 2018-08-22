'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')
const querystring = require('querystring')

module.exports.create = (config, params) => {
  const path = `/v1/spaces/${config.space}/cors`
  const headers = headersUtils.injectKey({ 'Content-Type': 'application/json' }, config.accessKey)

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      method: 'POST',
      body: JSON.stringify(params),
      headers
    })
    .then((response) => {
      if (response.status !== 201) {
        let errorMessage = null
        return response
          .json()
          .then((res) => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`Failed to create CORS configuration due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to create CORS configuration and couldn't parse error body.`)
            }
          })
      }
      return response.json()
    })
}

module.exports.update = (config, params) => {
  const path = `/v1/spaces/${config.space}/cors/${params.corsId}`
  const headers = headersUtils.injectKey({ 'Content-Type': 'application/json' }, config.accessKey)

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      method: 'PUT',
      body: JSON.stringify(params),
      headers
    })
    .then((response) => {
      if (response.status !== 200) {
        let errorMessage = null
        return response
          .json()
          .then((res) => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(
                `Failed to update ${
                  params.corsId
                } CORS configuration due the error: ${errorMessage}`
              )
            } else {
              throw new Error(
                `Failed to update ${
                  params.corsId
                } CORS configuration and couldn't parse error body.`
              )
            }
          })
      }
      return response.json()
    })
}

module.exports.delete = (config, params) => {
  const path = `/v1/spaces/${config.space}/cors/${params.corsId}`
  const headers = headersUtils.injectKey({}, config.accessKey)

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      method: 'DELETE',
      headers
    })
    .then((response) => {
      if (response.status !== 204) {
        let errorMessage = null
        return response
          .json()
          .then((res) => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(
                `Failed to delete ${
                  params.corsId
                } CORS configuration due the error: ${errorMessage}`
              )
            } else {
              throw new Error(
                `Failed to delete ${
                  params.corsId
                } CORS configuration and couldn't parse error body.`
              )
            }
          })
      }
      return undefined
    })
}

module.exports.list = (config, filters) => {
  const path = `/v1/spaces/${config.space}/cors?${querystring.stringify(filters)}`

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      headers: headersUtils.injectKey({}, config.accessKey)
    })
    .then((response) => {
      if (response.status !== 200) {
        let errorMessage = null
        return response
          .json()
          .then((res) => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(
                `Failed to fetch the CORS configurations list due the error: ${errorMessage}`
              )
            } else {
              throw new Error(
                "Failed to fetch the CORS configurations list and couldn't parse error body."
              )
            }
          })
      }
      return response.json().then((res) => res.cors)
    })
}
