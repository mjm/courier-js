import "reflect-metadata"
import { FeedLoader } from "./repositories/feed_repository"
import defaultDb, { DatabasePoolType } from "./db"
import { SubscribedFeedLoader } from "./repositories/feed_subscription_repository"
import FeedService from "./services/feed_service"
import { PostLoader } from "./repositories/post_repository"
import PostService from "./services/post_service"
import { TweetLoader } from "./repositories/tweet_repository"
import TweetService from "./services/tweet_service"
import UserService, { UserIdProvider } from "./services/user_service"
import { Container, injectable } from "inversify"
import * as keys from "./key"
import EventService from "./services/event_service"
import Stripe from "stripe"
import Environment from "./env"
import BillingService from "./services/billing_service"
import { CustomerLoader } from "./repositories/customer_repository"
import { SubscriptionLoader } from "./repositories/subscription_repository"
import { parse as parseCookies } from "cookie"
import { IncomingMessage } from "http"
import BillingEventService from "./services/billing_event_service"
import PublishService from "./services/publish_service"
import NotificationService from "./services/notification_service"

const container = new Container({
  autoBindInjectable: true,
  defaultScope: "Request",
})
container.bind<string | null>(keys.Token).toConstantValue(null)
container.bind<DatabasePoolType>(keys.DB).toConstantValue(defaultDb)
container.bind<UserIdProvider>(keys.UserId).toProvider(context => {
  const user = context.container.get(UserService)
  return () => user.requireUserId()
})
container
  .bind<Stripe>(Stripe)
  .toDynamicValue(context => {
    const env = context.container.get(Environment)
    const stripe = new Stripe(env.stripeKey)

    // @ts-ignore
    stripe.on("request", req => {
      console.log(req)
    })

    // @ts-ignore
    stripe.on("response", res => {
      console.log(res)
    })

    return stripe
  })
  .inSingletonScope()

@injectable()
export class CourierContext {
  loaders: {
    feeds: FeedLoader
    subscribedFeeds: SubscribedFeedLoader
    posts: PostLoader
    tweets: TweetLoader
    customers: CustomerLoader
    subscriptions: SubscriptionLoader
  }

  user: UserService
  feeds: FeedService
  posts: PostService
  tweets: TweetService
  events: EventService
  billing: BillingService
  billingEvents: BillingEventService
  publish: PublishService
  notifications: NotificationService

  static async createForRequest(req: IncomingMessage): Promise<CourierContext> {
    const child = container.createChild()
    child.bind<string | null>(keys.Token).toConstantValue(getToken(req))

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
    events: EventService,
    billing: BillingService,
    billingEvents: BillingEventService,
    publish: PublishService,
    notifications: NotificationService,
    feedLoader: FeedLoader,
    subscribedFeedLoader: SubscribedFeedLoader,
    postLoader: PostLoader,
    tweetLoader: TweetLoader,
    customerLoader: CustomerLoader,
    subscriptionLoader: SubscriptionLoader
  ) {
    this.user = user
    this.feeds = feeds
    this.posts = posts
    this.tweets = tweets
    this.events = events
    this.billing = billing
    this.billingEvents = billingEvents
    this.publish = publish
    this.notifications = notifications

    this.loaders = {
      feeds: feedLoader,
      subscribedFeeds: subscribedFeedLoader,
      posts: postLoader,
      tweets: tweetLoader,
      customers: customerLoader,
      subscriptions: subscriptionLoader,
    }
  }
}

function getToken(req: IncomingMessage): string | null {
  const authz = req.headers.authorization
  if (authz && authz.startsWith("Bearer ")) {
    return authz.substring(7)
  }

  // fallback to checking for cookie
  const cookies = parseCookies(req.headers.cookie || "")
  const cookie = cookies.accessToken
  if (cookie) {
    return cookie
  }

  return null
}
