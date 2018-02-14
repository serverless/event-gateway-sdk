const path = require('path')
const spawn = require('child_process').spawn
// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const uuidv1 = require('uuid/v1')
// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const rimraf = require('rimraf')
const octokit = require('@octokit/rest')()
const http = require('http')
const fs = require('fs')
const tar = require('tar-fs')

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000
const eventGatewayPath = path.join(__dirname, `event-gateway-${process.platform}_amd64`)

octokit.repos.getLatestRelease({ owner: 'serverless', repo: 'event-gateway' }).then(result => {
  if (!result.assets) throw new Error('No assets in the latest release')

  const toDownload = result.assets.find(
    asset => asset && asset.name && asset.name.includes(`${process.platform}_amd64`)
  )
  if (!toDownload) throw new Error('No asset found in the latest release that matches the platform')

  const file = fs.createWriteStream(eventGatewayPath)
  http.get(toDownload.browser_download_url, response => {
    response.pipe(tar.extract(file))
  })
}).catch(err => {
  throw new Error(err)
})
const processStore = {}

module.exports = {
  spawn: ports =>
    new Promise(resolve => {
      const processId = uuidv1()
      const args = [
        '--dev',
        `--embed-data-dir=${processId}`,
        `--config-port=${ports.configPort}`,
        `--events-port=${ports.apiPort}`,
        // `--embed-peer-addr=http://127.0.0.1:${ports.embedPeerPort}`,
        // `--embed-cli-addr=http://127.0.0.1:${ports.embedCliPort}`,
      ]
      processStore[processId] = spawn(eventGatewayPath, args, {
        stdio: 'inherit',
      })
      setTimeout(
        () =>
          resolve({
            id: processId,
            configPort: ports.configPort,
            apiPort: ports.apiPort,
          }),
        4000
      )
    }),
  shutDown: id => {
    processStore[id].kill()
    rimraf.sync(`./${id}`)
  },
}
