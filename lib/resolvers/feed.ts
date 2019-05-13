import { FeedResolvers } from "../generated/graphql"
import { allPostsForFeed } from "../data/post"

export const Feed: FeedResolvers = {
  posts(feed, args) {
    return allPostsForFeed(feed.id, args)
  },
}
