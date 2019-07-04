import "reflect-metadata"
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
import { IncomingHttpHeaders, IncomingMessage } from "http"
import UserService from "./services/user_service"
import { Container, injectable, inject } from "inversify"

const container = new Container({
  autoBindInjectable: true,
  defaultScope: "Request",
})
container.bind<string | null>("token").toConstantValue(null)
container.bind<DatabasePoolType>("db").toConstantValue(defaultDb)

container.bind<FeedLoader>("FeedLoader").toDynamicValue(context => {
  const feeds = context.container.get(FeedRepository)
  return feeds.createLoader()
})
container
  .bind<SubscribedFeedLoader>("SubscribedFeedLoader")
  .toDynamicValue(context => {
    const feedSubscriptions = context.container.get(FeedSubscriptionRepository)
    const user = context.container.get(UserService)
    return feedSubscriptions.createLoader(() => user.getUserId())
  })
container.bind<PostLoader>("PostLoader").toDynamicValue(context => {
  const posts = context.container.get(PostRepository)
  return posts.createLoader()
})
container.bind<TweetLoader>("TweetLoader").toDynamicValue(context => {
  const tweets = context.container.get(TweetRepository)
  const user = context.container.get(UserService)
  return tweets.createLoader(() => user.getUserId())
})

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
    @inject("FeedLoader") feedLoader: FeedLoader,
    @inject("SubscribedFeedLoader") subscribedFeedLoader: SubscribedFeedLoader,
    @inject("PostLoader") postLoader: PostLoader,
    @inject("TweetLoader") tweetLoader: TweetLoader
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
