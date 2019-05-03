import { ApolloServer, gql } from "apollo-server-micro"
import micro from "../lib/micro"

const typeDefs = gql`
  type Query {
    sayHello: String!
  }
`

const resolvers = {
  Query: {
    sayHello() {
      return "Hello World!"
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })
const handler = server.createHandler()

export default micro(handler)
