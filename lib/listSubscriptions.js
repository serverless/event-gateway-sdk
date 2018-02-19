'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')

module.exports = config => {
  const path = `/v1/spaces/${config.space}/subscriptions`

  return config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, path), {
      headers: headersUtils.injectToken({}),
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
