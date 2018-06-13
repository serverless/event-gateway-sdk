'use strict'

module.exports = (config, event) => {
  return config
    .fetch(`${config.eventsUrl}`, {
      method: 'POST',
      body: JSON.stringify(event),
      headers: {
        'Content-Type': 'application/cloudevents+json'
      }
    })
    .then(response => {
      if (response.status !== 202) {
        response.json().then(err => {
          throw new Error(`Failed to emit the event ${event.eventType} due the error: ${err}`)
        })
      }
      return response
    })
}
