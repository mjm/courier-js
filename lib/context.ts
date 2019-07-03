import { ContextFunction } from "apollo-server-core"
import { getToken, verify } from "./auth"
import { UserToken, UserId } from "./data/types"
import { createLoaders } from "./loaders"
import FeedRepository, { FeedLoader } from "./repositories/feed_repository"
import db from "./db"
import FeedSubscriptionRepository, {
  SubscribedFeedLoader,
} from "./repositories/feed_subscription_repository"
import FeedService from "./services/feed_service"

export interface CourierContext {
  token: string | null
  getUser: () => Promise<UserToken>
  loaders: {
    feeds: FeedLoader
    subscribedFeeds: SubscribedFeedLoader
  }
  feeds: FeedService
}

const context: ContextFunction<any, CourierContext> = async ({ req }) => {
  const token = getToken(req.headers)
  const verifyPromise: Promise<UserToken> = verify(token)

  let userId: UserId | null = null
  try {
    const { sub } = await verifyPromise
    userId = sub
  } catch (e) {
    // let this fail silently here
    // if resolvers need there to be a valid user, they will bubble the error
  }

  const feedRepo = new FeedRepository(db)
  const feedSubscriptionRepo = new FeedSubscriptionRepository(db)

  const feedLoader = feedRepo.createLoader()
  const subscribedFeedLoader = feedSubscriptionRepo.createLoader(userId)

  const feeds = new FeedService(
    userId,
    feedRepo,
    feedSubscriptionRepo,
    feedLoader,
    subscribedFeedLoader
  )

  return {
    token,
    async getUser() {
      return verifyPromise
    },
    loaders: {
      feeds: feedLoader,
      subscribedFeeds: subscribedFeedLoader,
      ...createLoaders(),
    },
    feeds,
  }
}

export default context
