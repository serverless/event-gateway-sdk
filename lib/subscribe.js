'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')

module.exports = (config, params) => {
  const path = `/v1/spaces/${config.space}/subscriptions`

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      method: 'POST',
      body: JSON.stringify(params),
      headers: headersUtils.injectToken({ 'Content-Type': 'application/json' }),
    })
    .then(response => {
      if (response.status !== 201) {
        let errorMessage = null
        const tmpMsg = `Failed to subscribe the event ${params.event}`
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
