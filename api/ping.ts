import micro from "../lib/micro"
import { xmlrpc, XMLRPCRequestHandler } from "../lib/xmlrpc"
import db from "../lib/db"
import FeedRepository from "../lib/repositories/feed_repository"
import FeedSubscriptionRepository from "../lib/repositories/feed_subscription_repository"
import FeedService from "../lib/services/feed_service"

const feedRepo = new FeedRepository(db)
const feedSubscriptionRepo = new FeedSubscriptionRepository(db)
const feedLoader = feedRepo.createLoader()
const subscribedFeedLoader = feedSubscriptionRepo.createLoader()

const feedService = new FeedService(
  null,
  feedRepo,
  feedSubscriptionRepo,
  feedLoader,
  subscribedFeedLoader
)

const handler: XMLRPCRequestHandler = async ({ methodName, params }) => {
  if (methodName === "weblogUpdates.ping") {
    const [title, homePageURL] = params
    console.log(`Received ping for [${title}](${homePageURL})`)

    await feedService.refreshAllByHomePageURL(homePageURL)

    return {
      flerror: false,
      message: "Thanks for the ping.",
    }
  } else {
    const err = new Error(
      `This server doesn't understand the '${methodName}' method`
    )
    // @ts-ignore
    err.faultCode = 404
    // @ts-ignore
    err.faultString = err.message
    throw err
  }
}

export default micro(xmlrpc(handler))
