import { FeedResolvers, SubscribedFeedResolvers } from "../generated/graphql"

export const Feed: FeedResolvers = {
  posts(feed, args, { posts }) {
    return posts.pagedByFeed(feed.id, args)
  },
}

export const SubscribedFeed: SubscribedFeedResolvers = {
  async feed({ feedId }, {}, { loaders }) {
    return (await loaders.feeds.load(feedId))!
  },
}
