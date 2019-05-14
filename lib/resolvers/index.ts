import * as query from "./query"
import * as mutation from "./mutation"
import * as paging from "./paging"
import * as date from "./date"
import * as feed from "./feed"
import * as post from "./post"
import * as tweet from "./tweet"
import { Resolvers } from "../generated/graphql"

const resolvers: Resolvers = {
  ...query,
  ...mutation,
  ...paging,
  ...date,
  ...feed,
  ...post,
  ...tweet,
}

export default resolvers
