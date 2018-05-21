'use strict'

module.exports = {
  injectKey: (headers, key) => {
    let updatedHeaders = Object.assign({}, headers)
    const accessKey = key || process.env.EVENT_GATEWAY_ACCESS_KEY
    if (accessKey) {
      updatedHeaders['Authorization'] = `bearer ${accessKey}`
    }
    return updatedHeaders
  }
}
