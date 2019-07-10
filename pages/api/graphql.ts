import { ApolloServer, makeExecutableSchema, gql } from "apollo-server-micro"
import resolvers from "../../lib/resolvers"
import { CourierContext } from "../../lib/context"

const schemaText = require("../../schema.graphql").default

const typeDefs = gql`
  ${schemaText}
`

const schema = makeExecutableSchema({ typeDefs, resolvers: resolvers as any })

const server = new ApolloServer({
  schema,
  context: async ({ req }) => CourierContext.createForRequest(req),
  introspection: true,
  playground: true,
})

export default server.createHandler({ path: "/api/graphql" })

export const config = {
  api: {
    bodyParser: false,
  },
}
