'use strict'

module.exports = (config, params) => {
  const data = params.dataType ? params.data : JSON.stringify(params.data)
  return config
    .fetch(`${config.apiUrl}`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': params.dataType || 'application/json',
        Event: 'invoke',
        'Function-ID': params.functionId,
      },
    })
    .then(response => {
      if (response.status !== 200) {
        let errorMessage = null
        return response
          .json()
          .then(res => {
            errorMessage = res.errors[0].message
            throw new Error(`Internal rethrow of ${errorMessage}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(
                `Failed to invoke function ${params.functionId} due the error: ${errorMessage}`
              )
            } else {
              throw new Error(
                `Failed to invoke function ${params.functionId} and couldn't parse error body.`
              )
            }
          })
      }
      return response
    })
}
