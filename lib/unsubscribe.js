'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')

module.exports = (config, params) => {
  const path = `/v1/spaces/${config.space}/subscriptions/${params.subscriptionId}`

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      method: 'DELETE',
      headers: headersUtils.injectKey({}, config.apikey)
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
