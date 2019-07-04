import "reflect-metadata"
import { FeedLoader } from "./repositories/feed_repository"
import defaultDb, { DatabasePoolType } from "./db"
import { SubscribedFeedLoader } from "./repositories/feed_subscription_repository"
import FeedService from "./services/feed_service"
import { PostLoader } from "./repositories/post_repository"
import PostService from "./services/post_service"
import { TweetLoader } from "./repositories/tweet_repository"
import TweetService from "./services/tweet_service"
import { IncomingHttpHeaders, IncomingMessage } from "http"
import UserService from "./services/user_service"
import { Container, injectable } from "inversify"

const container = new Container({
  autoBindInjectable: true,
  defaultScope: "Request",
})
container.bind<string | null>("token").toConstantValue(null)
container.bind<DatabasePoolType>("db").toConstantValue(defaultDb)

@injectable()
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
    const child = container.createChild()
    child.bind<string | null>("token").toConstantValue(getToken(req.headers))

    return child.get(CourierContext)
  }

  static create(): CourierContext {
    return container.get(CourierContext)
  }

  constructor(
    user: UserService,
    feeds: FeedService,
    posts: PostService,
    tweets: TweetService,
    feedLoader: FeedLoader,
    subscribedFeedLoader: SubscribedFeedLoader,
    postLoader: PostLoader,
    tweetLoader: TweetLoader
  ) {
    this.user = user
    this.feeds = feeds
    this.posts = posts
    this.tweets = tweets

    this.loaders = {
      feeds: feedLoader,
      subscribedFeeds: subscribedFeedLoader,
      posts: postLoader,
      tweets: tweetLoader,
    }
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
