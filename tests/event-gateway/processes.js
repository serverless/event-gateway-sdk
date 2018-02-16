const path = require('path')
const spawn = require('child_process').spawn
// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const uuidv1 = require('uuid/v1')
// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const rimraf = require('rimraf')
const octokit = require('@octokit/rest')()
const got = require('got')
const fs = require('fs')
const tarStream = require('tar-stream')
const gunzipMaybe = require('gunzip-maybe')

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000

const downloadPromise = octokit.repos.getLatestRelease(
  { owner: 'serverless', repo: 'event-gateway' }
).then(response => {
  const assets = response && response.data && response.data.assets
  if (!assets || !Array.isArray(assets)) throw new Error('No assets in the latest release')
  const toDownload = assets.find(
    asset => asset && asset.name && asset.name.includes(`${process.platform}_amd64`))
  if (!toDownload) throw new Error('No asset found in the latest release that matches the platform')

  return new Promise((resolve, reject) => {
    const gotStream = got.stream(toDownload.browser_download_url)
    const extractionStream = gotStream.pipe(gunzipMaybe()).pipe(tarStream.extract())
    extractionStream.on('end', resolve)
    extractionStream.on('error', reject)
    extractionStream.on('finish', resolve)
    extractionStream.on('entry', (header, stream, next) => {
      const writePath = path.join(__dirname, header.name)
      const writeStream = fs.createWriteStream(writePath, { end: true, mode: header.mode })
      writeStream.on('error', reject)
      stream.pipe(writeStream)
      stream.on('end', next)
    })
  })
}).catch(error => {
  throw new Error((error.response && error.response.body) || (error && error.message))
})
const processStore = {}

module.exports = {
  spawn: ports =>
    downloadPromise.then(() => new Promise(resolve => {
      const processId = uuidv1()
      const args = [
        '--dev',
        `--embed-data-dir=${processId}`,
        `--config-port=${ports.configPort}`,
        `--events-port=${ports.apiPort}`,
        // `--embed-peer-addr=http://127.0.0.1:${ports.embedPeerPort}`,
        // `--embed-cli-addr=http://127.0.0.1:${ports.embedCliPort}`,
      ]
      processStore[processId] = spawn(path.join(__dirname, 'event-gateway'), args, {
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
    })),
  shutDown: id => {
    processStore[id].kill()
    rimraf.sync(`./${id}`)
  },
}
