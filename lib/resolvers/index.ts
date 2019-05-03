import * as query from "./query"
import * as mutation from "./mutation"
import { Resolvers } from "../generated/graphql"

const resolvers: Resolvers = {
  ...query,
  ...mutation,
}

export default resolvers
