import * as query from "./query"
import * as mutation from "./mutation"
import * as date from "./date"
import { Resolvers } from "../generated/graphql"

const resolvers: Resolvers = {
  ...query,
  ...mutation,
  ...date,
}

export default resolvers
