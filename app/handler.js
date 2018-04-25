'use strict'

const handle = require('./graphql')

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify(body)
})

module.exports.graphql = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  let body = event.body
  if (event && event.body && !(event.body.query || event.body.mutation)) {
    body = JSON.parse(event.body)
  }
  handle.run(body.query, body.variables, {})
    .then(response => {
      return callback(null, createResponse(200, response))
    }).catch(error => {
      log.error('err = ', error)
      return callback(error)
    })
}
