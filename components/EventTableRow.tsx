import Moment from "react-moment"
import { createFragmentContainer, graphql } from "react-relay"

import Link from "next/link"

import { EventTableRow_event } from "@generated/EventTableRow_event.graphql"

const EventTableRow: React.FC<{
  event: EventTableRow_event
}> = ({ event }) => {
  return (
    <div
      className={`p-4 flex items-baseline justify-stretch border-neutral-2 border-t first:border-0`}
    >
      <div className="flex-grow truncate text-neutral-10">
        <EventDescription event={event} />
      </div>
      <div className="flex-shrink-0 ml-4 text-sm text-neutral-8">
        <Moment fromNow>{event.createdAt}</Moment>
      </div>
    </div>
  )
}

export default createFragmentContainer(EventTableRow, {
  event: graphql`
    fragment EventTableRow_event on Event {
      id
      eventType
      createdAt
      feed {
        id
        title
      }
      tweetGroup {
        id
        tweets {
          body
        }
      }
      boolValue
    }
  `,
})

const EventDescription: React.FC<{
  event: EventTableRow_event
}> = ({ event }) => {
  const tweets = event.tweetGroup?.tweets
  const tweetBody = tweets?.length ? tweets[0].body : "no body"
  const feed = event.feed as EventTableRow_event["feed"] & {}

  switch (event.eventType) {
    case "FEED_SET_AUTOPOST":
      return (
        <>
          You turned {event.boolValue ? "on" : "off"} autoposting for{" "}
          <FeedLink id={feed.id} title={feed.title} />
        </>
      )
    case "FEED_REFRESH":
      return (
        <>
          You refreshed <FeedLink id={feed.id} title={feed.title} />
        </>
      )
    case "FEED_SUBSCRIBE":
      return (
        <>
          You subscribed to <FeedLink id={feed.id} title={feed.title} />
        </>
      )
    case "FEED_UNSUBSCRIBE":
      return (
        <>
          You unsubscribed from <FeedLink id={feed.id} title={feed.title} />
        </>
      )
    case "TWEET_CANCEL":
      return (
        <>
          You canceled a draft tweet: <em>{tweetBody}</em>
        </>
      )
    case "TWEET_UNCANCEL":
      return (
        <>
          You turned a canceled tweet back into a draft: <em>{tweetBody}</em>
        </>
      )
    case "TWEET_EDIT":
      return (
        <>
          You edited a draft tweet: <em>{tweetBody}</em>
        </>
      )
    case "TWEET_POST":
      return (
        <>
          You posted to Twitter: <em>{tweetBody}</em>
        </>
      )
    case "TWEET_AUTOPOST":
      return (
        <>
          Your tweet autoposted to Twitter: <em>{tweetBody}</em>
        </>
      )
    case "SUBSCRIPTION_CREATE":
      return <>You subscribed to Courier</>
    case "SUBSCRIPTION_RENEW":
      return <>Your Courier subscription renewed automatically</>
    case "SUBSCRIPTION_CANCEL":
      return <>You canceled your Courier subscription</>
    case "SUBSCRIPTION_REACTIVATE":
      return <>You reactivated your Courier subscription before it expired</>
    case "SUBSCRIPTION_EXPIRE":
      return <>Your Courier subscription expired</>
    default:
      return <></>
  }
}

const FeedLink: React.FC<{ id: string; title: string }> = ({ id, title }) => {
  return (
    <Link href="/feeds/[id]" as={`/feeds/${id}`}>
      <a className="font-medium text-primary-9 hover:underline">{title}</a>
    </Link>
  )
}
