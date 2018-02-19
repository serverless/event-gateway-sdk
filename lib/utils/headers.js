'use strict'

const assoc = require('ramda/src/assoc')

module.exports = {
  injectKey: (headers, key) => {
    let updatedHeaders = Object.assign({}, headers)
    const apiKey = key || process.env.EVENT_GATEWAY_APIKEY
    if (apiKey) {
      updatedHeaders = assoc('Authorization', `bearer ${apiKey}`, headers)
    }
    return updatedHeaders
  },
}
