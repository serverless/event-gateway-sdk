const path = require('path')
const fs = require('fs')
const got = require('got')
// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const unzipper = require('unzipper')
const octokit = require('@octokit/rest')()

const release = {
  owner: 'serverless',
  repo: 'event-gateway',
  tag: '0.6.0',
}

const download = target => {
  if (process.env.GH_API_KEY) {
    octokit.authenticate({
      type: 'token',
      token: process.env.GH_API_KEY,
    })
  }

  return octokit.repos.getReleaseByTag(release).then(response => {
    const assets = response.data.assets
    if (!assets || !Array.isArray(assets)) {
      throw new Error('No assets in the latest release')
    }

    const toDownload = assets.find(
      asset => asset && asset.name && asset.name.includes(`${process.platform}_amd64`))
    if (!toDownload) {
      throw new Error('No asset found in the latest release that matches the platform')
    }

    return new Promise((resolve, reject) => {
      const gotStream = got.stream(toDownload.browser_download_url)
      // eslint-disable-next-line
      const extractionStream = gotStream.pipe(unzipper.Extract({ path: target }))
      extractionStream.on('close', resolve)
      extractionStream.on('error', reject)
    })
  })
  .catch(error => {
    throw new Error((error.response && error.response.body) || (error && error.message))
  })
}

const main = () => {
  const target = path.join(__dirname, '../event-gateway', release.tag)

  if (fs.existsSync(target)) {
    return
  }

  // eslint-disable-next-line
  console.log(`Downloading Event Gateway ${release.tag}....`)

  download(target).then(() => {
    fs.chmodSync(path.join(target, 'event-gateway'), '755')

    // eslint-disable-next-line
    console.log('Downloaded.')
  })
}

main()
