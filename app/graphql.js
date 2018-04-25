'use strict'

const {
  graphql,
  GraphQLError,
  GraphQLInt,
  GraphQLSchema,
  GraphQLObjectType
} = require('graphql')

class ApiError extends Error {
  constructor(type, ...errors) {
    super(...errors)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
    this.extensions = {
      date: new Date(),
      type,
      errors
    };
  }
}

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => ({
      hello: {
        type: GraphQLInt,
        resolve: (root, args, {db, loaders}) => {
          return 7
        }
      },
      helloError: {
        type: GraphQLInt,
        resolve: (root, args, {db, loaders}) => {
          throw new GraphQLError(new ApiError('INPUT', {key: 'DUPLICATE', message: `Duplicate quote request.`}))
        }
      }
    })
  })
})
module.exports.schema = schema

const run = (query, variables, params) => {
  console.log('query = ', query)
  return graphql(schema, query, null, params, variables)
}
module.exports.run = run
