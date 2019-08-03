import * as query from "./query"
import * as mutation from "./mutation"
import * as paging from "./paging"
import * as date from "./date"
import * as event from "./event"
import * as feed from "./feed"
import * as microformat from "./microformat"
import * as post from "./post"
import * as tweet from "./tweet"
import * as user from "./user"
import { Resolvers } from "../generated/graphql"

const resolvers: Resolvers = {
  ...query,
  ...mutation,
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
