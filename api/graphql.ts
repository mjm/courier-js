import { ApolloServer, makeExecutableSchema, gql } from "apollo-server-micro"
import micro from "../lib/micro"
import { readFileSync } from "fs"
import * as path from "path"
import resolvers from "../lib/resolvers"
import context from "../lib/context"

const typeDefs = gql`
  ${readFileSync(path.join(__dirname, "../schema.graphql")).toString("utf8")}
`

const schema = makeExecutableSchema({ typeDefs, resolvers: resolvers as any })

const server = new ApolloServer({ schema, context })
const handler = server.createHandler()

export default micro(handler)
