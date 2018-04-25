/* eslint-disable no-console */

require('babel-polyfill')

const express = require('express')
const graphqlHTTP = require('express-graphql')
const parseArgs = require('minimist')

const schema = require('../app/graphql').schema

const app = express()

app.options('/graphql', (req, res) => {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Methods', 'OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  res.sendStatus(200)
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('')
  next()
})
app.use(express.static(__dirname))
app.use('/graphql', graphqlHTTP(() => (
  {
    context: {},
    schema,
    graphiql: true
  }
)))

const args = parseArgs(process.argv.slice(2))
const port = args.port || 5012

/* eslint-disable func-names */
app.listen(port, function() {
  const portAddress = this.address().port
  console.log(`Started on http://localhost:${portAddress}/`)
})
