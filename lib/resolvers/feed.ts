import { FeedResolvers, SubscribedFeedResolvers } from "../generated/graphql"
import { toExternalId, IdPrefix } from "lib/data/id"
import { Feed as FeedData } from "lib/data/types"

export const Feed: FeedResolvers = {
  id({ id }) {
    return toExternalId(IdPrefix.Feed, id)
  },

  posts(feed, args, { posts }) {
    return posts.pagedByFeed(feed.id, args)
  },
}

export const SubscribedFeed: SubscribedFeedResolvers = {
  id({ id }) {
    return toExternalId(IdPrefix.FeedSubscription, id)
  },

  async feed({ feedId }, _, { loaders }) {
    return (await loaders.feeds.load(feedId)) as FeedData
  },
}
