import FeedRepository, { FeedLoader } from "./repositories/feed_repository"
import defaultDb, { DatabasePoolType } from "./db"
import FeedSubscriptionRepository, {
  SubscribedFeedLoader,
} from "./repositories/feed_subscription_repository"
import FeedService from "./services/feed_service"
import PostRepository, { PostLoader } from "./repositories/post_repository"
import PostService from "./services/post_service"
import TweetRepository, { TweetLoader } from "./repositories/tweet_repository"
import TweetService from "./services/tweet_service"
import ImportService from "./services/import_service"
import { IncomingHttpHeaders, IncomingMessage } from "http"
import UserService from "./services/user_service"
import TwitterService from "./services/twitter_service"
import { UserId } from "./data/types"

export class CourierContext {
  loaders: {
    feeds: FeedLoader
    subscribedFeeds: SubscribedFeedLoader
    posts: PostLoader
    tweets: TweetLoader
  }

  user: UserService
  feeds: FeedService
  posts: PostService
  tweets: TweetService

  static async createForRequest(req: IncomingMessage): Promise<CourierContext> {
    const userService = this.createUserService(getToken(req.headers))
    const userId = await userService.getUserId()
    return new CourierContext(userService, userId)
  }

  static create(): CourierContext {
    const userService = this.createUserService(null)
    return new CourierContext(userService, null)
  }

  private constructor(
    user: UserService,
    userId: UserId | null,
    db: DatabasePoolType = defaultDb
  ) {
    this.user = user

    const feedRepo = new FeedRepository(db)
    const feedSubscriptionRepo = new FeedSubscriptionRepository(db)
    const postRepo = new PostRepository(db)
    const tweetRepo = new TweetRepository(db)

    this.loaders = {
      feeds: feedRepo.createLoader(),
      subscribedFeeds: feedSubscriptionRepo.createLoader(userId),
      posts: postRepo.createLoader(),
      tweets: tweetRepo.createLoader(userId),
    }

    const importService = new ImportService(
      feedSubscriptionRepo,
      postRepo,
      tweetRepo,
      this.loaders.subscribedFeeds,
      this.loaders.posts,
      this.loaders.tweets
    )

    const twitter = new TwitterService(
      requireEnv("TWITTER_CONSUMER_KEY"),
      requireEnv("TWITTER_CONSUMER_SECRET"),
      this.user
    )

    this.feeds = new FeedService(
      userId,
      feedRepo,
      feedSubscriptionRepo,
      this.loaders.feeds,
      this.loaders.subscribedFeeds,
      importService
    )

    this.posts = new PostService(postRepo)

    this.tweets = new TweetService(
      userId,
      tweetRepo,
      this.loaders.tweets,
      this.loaders.subscribedFeeds,
      twitter
    )
  }

  private static createUserService(token: string | null): UserService {
    return new UserService(
      token,
      requireEnv("AUTH_DOMAIN"),
      requireEnv("API_IDENTIFIER"),
      requireEnv("CLIENT_ID"),
      requireEnv("BACKEND_CLIENT_ID"),
      requireEnv("BACKEND_CLIENT_SECRET")
    )
  }
}

function getToken(headers: IncomingHttpHeaders): string | null {
  const authz = headers.authorization
  if (!authz) {
    return null
  }

  if (!authz.startsWith("Bearer ")) {
    return null
  }

  return authz.substring(7)
}

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`No ${key} set in environment`)
  }

  return value
}
