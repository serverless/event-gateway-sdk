'use strict'

module.exports = {
  joinUrlWithPath: (baseUrl, path) => {
    const urlHasSlash = baseUrl.slice(-1) === '/'
    const pathHasSlash = path[0] === '/'
    if (urlHasSlash && pathHasSlash) {
      return `${baseUrl}${path.substring(1)}`
    } else if (!urlHasSlash && !pathHasSlash) {
      return `${baseUrl}/${path}`
    }
    return `${baseUrl}${path}`
  }
}
