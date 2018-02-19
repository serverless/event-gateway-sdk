'use strict'

const keys = require('ramda/src/keys')
const contains = require('ramda/src/contains')
const assoc = require('ramda/src/assoc')

module.exports = {
  injectToken: (headers, token) => {
    let updatedHeaders = Object.assign({}, headers)
    let authToken = token || ''
    if (authToken === '' && contains('EVENT_GATEWAY_TOKEN', keys(process.env))) {
      authToken = process.env.EVENT_GATEWAY_TOKEN
    }
    if (authToken !== '') {
      updatedHeaders = assoc('Authorization', `bearer ${authToken}`, headers)
    }
    return updatedHeaders
  },
}
