'use strict'

const {
  graphql,
  GraphQLError,
  GraphQLInt,
  GraphQLSchema,
  GraphQLObjectType,
  formatError
} = require('graphql')

class ApiError extends Error {
  constructor(type, errors) {
    super(type)
    this.extensions =  { errors }
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
          throw new ApiError('INPUT', {key: 'DUPLICATE', message: `Duplicate quote request.`, test: 'test123'})
          // return new GraphQLError(
          //   'Duplicate quote request.',
          //   null,
          //   null,
          //   null,
          //   null,
          //   null,
          //   {key: 'DUPLICATE', type: `custom type.`, date: 'now'}
          // );
        }
      }
    })
  })
})
module.exports.schema = schema

const run = (query, variables, params) => {
  console.log('query = ', query)
  return graphql(schema, query, null, params, variables)
    .then(result => {
      if (result && result.errors) {
        result.errors = result.errors.map(formatError);
      }
      return result
    })
}
module.exports.run = run