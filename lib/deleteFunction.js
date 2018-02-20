'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')

module.exports = (config, params) => {
  const path = `/v1/spaces/${config.space}/functions/${params.functionId}`
  const headers = headersUtils.injectKey({}, config.apikey)

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
