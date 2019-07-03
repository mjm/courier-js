import { ContextFunction } from "apollo-server-core"
import { getToken, verify } from "./auth"
import { UserToken, UserId } from "./data/types"
import FeedRepository, { FeedLoader } from "./repositories/feed_repository"
import db from "./db"
import FeedSubscriptionRepository, {
  SubscribedFeedLoader,
} from "./repositories/feed_subscription_repository"
import FeedService from "./services/feed_service"
import PostRepository, { PostLoader } from "./repositories/post_repository"
import PostService from "./services/post_service"

export interface CourierContext {
  token: string | null
  getUser: () => Promise<UserToken>
  loaders: {
    feeds: FeedLoader
    subscribedFeeds: SubscribedFeedLoader
    posts: PostLoader
  }
  feeds: FeedService
  posts: PostService
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
  const postRepo = new PostRepository(db)

  const feedLoader = feedRepo.createLoader()
  const subscribedFeedLoader = feedSubscriptionRepo.createLoader(userId)
  const postLoader = postRepo.createLoader()

  const feeds = new FeedService(
    userId,
    feedRepo,
    feedSubscriptionRepo,
    feedLoader,
    subscribedFeedLoader
  )

  const posts = new PostService(postRepo)

  return {
    token,
    async getUser() {
      return verifyPromise
    },
    loaders: {
      feeds: feedLoader,
      subscribedFeeds: subscribedFeedLoader,
      posts: postLoader,
    },
    feeds,
    posts,
  }
}

export default context
