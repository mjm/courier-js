import Moment from "react-moment"
import { createFragmentContainer, graphql } from "react-relay"
import { EventTableRow_event } from "../lib/__generated__/EventTableRow_event.graphql"

interface Props {
  event: EventTableRow_event
}

const EventTableRow: React.FC<Props> = ({ event }) => {
  return (
    <tr>
      <td>
        <EventDescription event={event} />
      </td>
      <td>
        <Moment fromNow>{event.createdAt}</Moment>
      </td>
    </tr>
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
      tweet {
        id
        body
      }
      boolValue
    }
  `,
})

interface EventDescriptionProps {
  event: EventTableRow_event
}

const EventDescription: React.FC<EventDescriptionProps> = ({ event }) => {
  const feedTitle = event.feed && event.feed.title
  const tweetBody = event.tweet && event.tweet.body

  switch (event.eventType) {
    case "FEED_SET_AUTOPOST":
      return (
        <>
          You turned {event.boolValue ? "on" : "off"} autoposting for{" "}
          <em>{feedTitle}</em>
        </>
      )
    case "FEED_REFRESH":
      return (
        <>
          You refreshed <em>{feedTitle}</em>
        </>
      )
    case "FEED_SUBSCRIBE":
      return (
        <>
          You subscribed to <em>{feedTitle}</em>
        </>
      )
    case "FEED_UNSUBSCRIBE":
      return (
        <>
          You unsubscribed from <em>{feedTitle}</em>
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
