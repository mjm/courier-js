import micro, { RequestHandler, send } from "../lib/micro"
import db from "../lib/db"
import TweetService from "../lib/services/tweet_service"
import FeedSubscriptionRepository from "../lib/repositories/feed_subscription_repository"
import TweetRepository from "../lib/repositories/tweet_repository"

const feedSubscriptionRepo = new FeedSubscriptionRepository(db)
const tweetRepo = new TweetRepository(db)

const subscribedFeedLoader = feedSubscriptionRepo.createLoader(null)
const tweetLoader = tweetRepo.createLoader(null)

const tweetService = new TweetService(
  null,
  tweetRepo,
  tweetLoader,
  subscribedFeedLoader
)

const handler: RequestHandler = async (_req, res) => {
  const results = await tweetService.postQueued()

  console.log(results)
  send(res, 200, results)
}

export default micro(handler)
