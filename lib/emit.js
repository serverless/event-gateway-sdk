'use strict'

module.exports = (config, event, options) => {
  let path = '/'
  let headers = {
    'Content-Type': 'application/cloudevents+json'
  }
  if (options) {
    path = options.path || path
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    headers = Object.assign(headers, options.headers)
  }
  return config
    .fetch(`${config.eventsUrl}${path}`, {
      method: 'POST',
      body: JSON.stringify(event),
      headers
    })
    .then(response => {
      if (response.status >= 400) {
        return response
          .json()
          .catch(() => {
            response.text(err => {
              throw new Error(`Failed to emit the event ${event.eventType} due the error: ${err}`)
            })
          })
          .then(response => {
            if (response.errors && response.errors[0]) {
              throw new Error(
                `Failed to emit the event ${event.eventType} due the error: ${response.errors[0].message}`
              )
            }
            throw new Error(`Failed to emit the event ${event.eventType}.`)
          })
      }
      return response
    })
}
