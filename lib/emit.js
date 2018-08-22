'use strict'

/* eslint-disable no-shadow */

module.exports = (config, event) => {
  return config
    .fetch(`${config.eventsUrl}`, {
      method: 'POST',
      body: JSON.stringify(event),
      headers: {
        'Content-Type': 'application/cloudevents+json'
      }
    })
    .then((response) => {
      if (response.status >= 400) {
        return response
          .json()
          .catch(() => {
            response.text((err) => {
              throw new Error(`Failed to emit the event ${event.eventType} due the error: ${err}`)
            })
          })
          .then((response) => {
            if (response.errors && response.errors[0]) {
              throw new Error(
                `Failed to emit the event ${event.eventType} due the error: ${
                  response.errors[0].message
                }`
              )
            }
            throw new Error(`Failed to emit the event ${event.eventType}.`)
          })
      }
      return response
    })
}
