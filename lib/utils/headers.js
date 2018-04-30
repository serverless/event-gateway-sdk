'use strict'

const assoc = require('ramda/src/assoc')

module.exports = {
  injectKey: (headers, key) => {
    let updatedHeaders = Object.assign({}, headers)
    const accessKey = key || process.env.EVENT_GATEWAY_ACCESS_KEY
    if (accessKey) {
      updatedHeaders = assoc('Authorization', `bearer ${accessKey}`, headers)
    }
    return updatedHeaders
  }
}
