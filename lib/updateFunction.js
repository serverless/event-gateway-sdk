'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')

module.exports = (config, params) => {
  const path = `/v1/spaces/${config.space}/functions/${params.functionId}`
  const headers = headersUtils.injectKey({ 'Content-Type': 'application/json' }, config.apiKey)

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      method: 'PUT',
      body: JSON.stringify(params),
      headers
    })
    .then(response => {
      if (response.status !== 200) {
        let errorMessage = null
        const funcId = params.functionId
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`Failed to update the function ${funcId} due the error: ${errorMessage}`)
            } else {
              throw new Error(`Failed to update the function ${funcId} and couldn't parse error body.`)
            }
          })
      }
      return response.json()
    })
}
