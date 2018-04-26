'use strict'

const last = require('ramda/src/last')

module.exports = {
  joinUrlWithPath: (baseUrl, path) => {
    const urlHasSlash = last(baseUrl) === '/'
    const pathHasSlash = path[0] === '/'
    if (urlHasSlash && pathHasSlash) {
      return `${baseUrl}${path.substring(1)}`
    } else if (!urlHasSlash && !pathHasSlash) {
      return `${baseUrl}/${path}`
    }
    return `${baseUrl}${path}`
  }
}
