import { IncomingMessage } from "http"

import "reflect-metadata"

import { parse as parseCookies } from "cookie"
import { Container, injectable } from "inversify"
import Libhoney, { Event } from "libhoney"
import Stripe from "stripe"

import { createDatabase, DatabasePoolType } from "lib/db"
import { createHoney, EventContext } from "lib/events"
import { DeviceTokenLoader } from "lib/repositories/device_token_repository"
import { EventLoader } from "lib/repositories/event_repository"

import Environment from "./env"
import * as keys from "./key"
import { CustomerLoader } from "./repositories/customer_repository"
import { FeedLoader } from "./repositories/feed_repository"
import { SubscribedFeedLoader } from "./repositories/feed_subscription_repository"
import { PostLoader } from "./repositories/post_repository"
import { SubscriptionLoader } from "./repositories/subscription_repository"
import { TweetLoader } from "./repositories/tweet_repository"
import BillingEventService from "./services/billing_event_service"
import BillingService from "./services/billing_service"
import EventService from "./services/event_service"
import FeedService from "./services/feed_service"
import NotificationService from "./services/notification_service"
import PostService from "./services/post_service"
import PublishService from "./services/publish_service"
import TweetService from "./services/tweet_service"
import UserService, { UserIdProvider } from "./services/user_service"

const container = new Container({
  autoBindInjectable: true,
  defaultScope: "Request",
})
container
  .bind(Libhoney)
  .toDynamicValue(createHoney)
  .inSingletonScope()
container
  .bind(EventContext)
  .toSelf()
  .inSingletonScope()
container.bind<string | null>(keys.Token).toConstantValue(null)
container
  .bind<DatabasePoolType>(keys.DB)
  .toDynamicValue(createDatabase)
  .inSingletonScope()
container.bind<UserIdProvider>(keys.UserId).toProvider(context => {
  const user = context.container.get(UserService)
  return () => user.requireUserId()
})
container
  .bind<Stripe>(Stripe)
  .toDynamicValue(context => {
    const env = context.container.get(Environment)
    const stripe = new Stripe(env.stripeKey)
    const events = context.container.get(EventContext)
    const evts = new Map<string, Event>()

    stripe.on("request", req => {
      const evt = events.startSpan("stripe_request")
      evt.add({
        "stripe.method": req.method,
        "stripe.path": req.path,
      })
      evts.set(`${req.method}__${req.path}__${req.request_start_time}`, evt)
      console.log(req)
    })

    stripe.on("response", res => {
      console.log(res)
      const evt = evts.get(
        `${res.method}__${res.path}__${res.request_start_time}`
      )
      if (!evt) {
        return
      }
      evt.add({
        "stripe.api_version": res.api_version,
        "stripe.status": res.status,
        "stripe.request_id": res.request_id,
      })
      events.stopSpan(evt)
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
    events: EventLoader
    deviceTokens: DeviceTokenLoader
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
  evt: EventContext

  static createForRequest(req: IncomingMessage): CourierContext {
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
    evt: EventContext,
    feedLoader: FeedLoader,
    subscribedFeedLoader: SubscribedFeedLoader,
    postLoader: PostLoader,
    tweetLoader: TweetLoader,
    customerLoader: CustomerLoader,
    subscriptionLoader: SubscriptionLoader,
    eventLoader: EventLoader,
    deviceTokenLoader: DeviceTokenLoader
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
    this.evt = evt

    this.loaders = {
      feeds: feedLoader,
      subscribedFeeds: subscribedFeedLoader,
      posts: postLoader,
      tweets: tweetLoader,
      customers: customerLoader,
      subscriptions: subscriptionLoader,
      events: eventLoader,
      deviceTokens: deviceTokenLoader,
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
