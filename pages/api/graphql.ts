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
  // @ts-ignore
  playground: {
    settings: {
      "request.credentials": "same-origin",
    },
  },
})

// HACK: the now dev routing with Next API routes is preserving the prefix,
// but in production it's stripped. No value supports both environments, so
// we just pass the right one as needed.
// const apiPath = process.env.NOW_REGION === "dev1" ? "/api/graphql" : "/graphql"
const apiPath = "/api/graphql"
export default server.createHandler({ path: apiPath })

export const config = {
  api: {
    bodyParser: false,
  },
}
