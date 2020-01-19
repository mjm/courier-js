import { IdPrefix,toExternalId } from "lib/data/id"
import { Feed } from "lib/data/types"

import { PostResolvers } from "../generated/graphql"

export const Post: PostResolvers = {
  id({ id }) {
    return toExternalId(IdPrefix.Post, id)
  },

  async feed({ feedId }, _, { loaders }) {
    return (await loaders.feeds.load(feedId)) as Feed
  },
}
