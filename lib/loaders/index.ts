import { feedLoader, subscribedFeedLoader } from "./feed"
import { postLoader } from "./post"
import { UserId } from "../data/types"

export function createLoaders(userId: UserId | null) {
  return {
    feeds: feedLoader(),
    posts: postLoader(),
    subscribedFeeds: subscribedFeedLoader(userId),
  }
}

export type Loaders = ReturnType<typeof createLoaders>
