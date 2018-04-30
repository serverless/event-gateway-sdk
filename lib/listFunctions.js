'use strict'

const urlUtils = require('./utils/url')
const headersUtils = require('./utils/headers')

module.exports = config => {
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
