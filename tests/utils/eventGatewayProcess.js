const path = require('path')
const spawn = require('child_process').spawn
// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const uuidv1 = require('uuid/v1')
// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const rimraf = require('rimraf')
const version = require('./version')

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000

const processStore = {}
const binary = path.join(__dirname, `../event-gateway/${version.EventGatewayVersion}/event-gateway`)

module.exports = {
  spawn: (ports) =>
    new Promise((resolve) => {
      const processId = uuidv1()
      const args = [
        '--dev',
        `--embed-data-dir=${processId}`,
        `--config-port=${ports.configPort}`,
        `--events-port=${ports.apiPort}`
      ]
      processStore[processId] = spawn(binary, args, {
        stdio: 'inherit'
      })
      setTimeout(
        () =>
          resolve({
            id: processId,
            configPort: ports.configPort,
            apiPort: ports.apiPort
          }),
        4000
      )
    }),

  shutDown: (id) => {
    processStore[id].kill()
    rimraf.sync(`./${id}`)
  }
}
