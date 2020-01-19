import { Resolvers } from "../generated/graphql"
import * as date from "./date"
import * as event from "./event"
import * as feed from "./feed"
import * as microformat from "./microformat"
import * as mutation from "./mutation"
import * as node from "./node"
import * as paging from "./paging"
import * as post from "./post"
import * as query from "./query"
import * as tweet from "./tweet"
import * as user from "./user"

const resolvers: Resolvers = {
  ...query,
  ...mutation,
  ...node,
  ...paging,
  ...date,
  ...event,
  ...feed,
  ...microformat,
  ...post,
  ...tweet,
  ...user,
}

export default resolvers
