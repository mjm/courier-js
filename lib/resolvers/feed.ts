import { FeedResolvers, SubscribedFeedResolvers } from "../generated/graphql"
import { allPostsForFeed } from "../data/post"

export const Feed: FeedResolvers = {
  posts(feed, args) {
    return allPostsForFeed(feed.id, args)
  },
}

export const SubscribedFeed: SubscribedFeedResolvers = {
  async feed({ feedId }, {}, { loaders }) {
    return (await loaders.feeds.load(feedId))!
  },
}
