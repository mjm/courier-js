import React from "react"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import Container, { FlushContainer } from "../components/container"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import { InfoField, InfoTable } from "../components/info"
import {
  CurrentUserComponent,
  RecentEventsComponent,
  EventFieldsFragment,
  EventType,
  UserFieldsFragment,
} from "../lib/generated/graphql-components"
import Loading from "../components/loading"
import { ErrorBox } from "../components/error"
import Card, { CardHeader } from "../components/card"
import Group from "../components/group"
import { Button } from "../components/button"
import {
  faSignOutAlt,
  faCopy,
  faCreditCard,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons"
import { logout, getToken } from "../utils/auth0"
import Moment from "react-moment"
import { useRouter } from "next/router"

const Account = () => {
  return (
    <Container>
      <Head title="Your Account" />

      <PageHeader mb={4}>Your Account</PageHeader>
      <FlushContainer>
        <Group direction="column" spacing={3}>
          <UserInfo />
          <RecentEvents />
        </Group>
      </FlushContainer>
      <Button
        mt={3}
        color="red"
        size="medium"
        icon={faSignOutAlt}
        onClick={() => logout()}
      >
        Sign Out
      </Button>
    </Container>
  )
}

export default withData(withSecurePage(Account))

const UserInfo = () => {
  return (
    <CurrentUserComponent fetchPolicy="cache-and-network">
      {({ data, error, loading }) => {
        if (loading && !(data && data.currentUser)) {
          return <Loading />
        }

        if (error) {
          return <ErrorBox error={error} />
        }

        if (!data || !data.currentUser) {
          return null
        }
        const user = data.currentUser
        return (
          <>
            <UserCard user={user} />
            <SubscriptionCard user={user} />
          </>
        )
      }}
    </CurrentUserComponent>
  )
}

interface UserCardProps {
  user: UserFieldsFragment
}
const UserCard = ({ user }: UserCardProps) => {
  async function copyAPIToken() {
    const token = getToken(null, "accessToken")
    if (token) {
      await navigator.clipboard.writeText(token)
    }
  }

  return (
    <Card>
      <InfoField label="Name">{user.name}</InfoField>
      <InfoField label="Twitter Username">
        <a href={`https://twitter.com/${user.nickname}`} target="_blank">
          @{user.nickname}
        </a>
      </InfoField>

      <Group mt={3} direction="row" spacing={2} wrap alignItems="center">
        <Button icon={faCopy} onClick={copyAPIToken}>
          Copy API Token
        </Button>
      </Group>
    </Card>
  )
}

interface SubscriptionCardProps {
  user: UserFieldsFragment
}
const SubscriptionCard = ({ user }: SubscriptionCardProps) => {
  const router = useRouter()
  const { customer, subscription } = user

  return (
    <Card>
      <CardHeader>Subscription</CardHeader>
      {subscription ? (
        <>
          <InfoField label="Status">{subscription.status}</InfoField>
          <InfoField label="Renews">
            <Moment format="LL">{subscription.periodEnd}</Moment> (
            <Moment fromNow>{subscription.periodEnd}</Moment>)
          </InfoField>
        </>
      ) : (
        <InfoField label="Status">Not subscribed</InfoField>
      )}
      {customer && customer.creditCard ? (
        <InfoField label="Payment">
          {customer.creditCard.brand} {customer.creditCard.lastFour}
        </InfoField>
      ) : (
        <InfoField label="Payment">No saved payment method</InfoField>
      )}
      <Group mt={3} direction="row" spacing={2} wrap>
        {subscription ? (
          <Button icon={faTimesCircle} color="red" invert>
            Cancel
          </Button>
        ) : (
          <Button icon={faCreditCard} onClick={() => router.push("/subscribe")}>
            Subscribe
          </Button>
        )}
      </Group>
    </Card>
  )
}

const RecentEvents = () => {
  return (
    <Card>
      <CardHeader>Recent Activity</CardHeader>
      <RecentEventsComponent fetchPolicy="cache-and-network">
        {({ data, loading, error }) => {
          if (loading && !(data && data.allEvents)) {
            return <Loading />
          }

          if (error) {
            return <ErrorBox error={error} />
          }

          if (!data) {
            return null
          }
          const events = data.allEvents.nodes
          if (!events.length) {
            return <>You haven't done anything yet.</>
          }
          return (
            <InfoTable>
              <colgroup>
                <col />
                <col css={{ width: "150px" }} />
              </colgroup>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td>
                      <EventDescription event={event} />
                    </td>
                    <td>
                      <Moment fromNow>{event.createdAt}</Moment>
                    </td>
                  </tr>
                ))}
              </tbody>
            </InfoTable>
          )
        }}
      </RecentEventsComponent>
    </Card>
  )
}

interface EventDescriptionProps {
  event: EventFieldsFragment
}
const EventDescription = ({ event }: EventDescriptionProps) => {
  const feedTitle = event.feed && event.feed.title
  const tweetBody = event.tweet && event.tweet.body

  switch (event.eventType) {
    case EventType.FeedSetAutopost:
      return (
        <>
          You turned {event.boolValue ? "on" : "off"} autoposting for{" "}
          <em>{feedTitle}</em>
        </>
      )
    case EventType.FeedRefresh:
      return (
        <>
          You refreshed <em>{feedTitle}</em>
        </>
      )
    case EventType.FeedSubscribe:
      return (
        <>
          You subscribed to <em>{feedTitle}</em>
        </>
      )
    case EventType.FeedUnsubscribe:
      return (
        <>
          You unsubscribed from <em>{feedTitle}</em>
        </>
      )
    case EventType.TweetCancel:
      return (
        <>
          You canceled a draft tweet: <em>{tweetBody}</em>
        </>
      )
    case EventType.TweetUncancel:
      return (
        <>
          You turned a canceled tweet back into a draft: <em>{tweetBody}</em>
        </>
      )
    case EventType.TweetEdit:
      return (
        <>
          You edited a draft tweet: <em>{tweetBody}</em>
        </>
      )
    case EventType.TweetPost:
      return (
        <>
          You posted to Twitter: <em>{tweetBody}</em>
        </>
      )
    case EventType.TweetAutopost:
      return (
        <>
          Your tweet autoposted to Twitter: <em>{tweetBody}</em>
        </>
      )
  }
}
