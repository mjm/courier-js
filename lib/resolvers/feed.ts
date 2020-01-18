import { FeedResolvers, SubscribedFeedResolvers } from "../generated/graphql"
import { toExternalId, IdPrefix } from "lib/data/id"

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

  async feed({ feedId }, {}, { loaders }) {
    return (await loaders.feeds.load(feedId))!
  },
}
