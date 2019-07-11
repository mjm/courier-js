import React from "react"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import Container from "../components/container"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import { InfoField, InfoTable } from "../components/info"
import {
  CurrentUserComponent,
  RecentEventsComponent,
  EventFieldsFragment,
  EventType,
} from "../lib/generated/graphql-components"
import Loading from "../components/loading"
import { ErrorBox } from "../components/error"
import Card, { CardHeader } from "../components/card"
import Group from "../components/group"
import { Button } from "../components/button"
import { faSignOutAlt, faCopy } from "@fortawesome/free-solid-svg-icons"
import { logout, getToken } from "../utils/auth0"
import Moment from "react-moment"

const Account = () => {
  async function copyAPIToken() {
    const token = getToken(null, "accessToken")
    if (token) {
      await navigator.clipboard.writeText(token)
    }
  }

  return (
    <div>
      <Container>
        <Head title="Your Account" />

        <PageHeader mb={4}>Your Account</PageHeader>
        <CurrentUserComponent>
          {({ data, error, loading }) => {
            if (loading) {
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
              <Group direction="column" spacing={3}>
                <Card>
                  <InfoField label="Name">{user.name}</InfoField>
                  <InfoField label="Twitter Username">
                    <a
                      href={`https://twitter.com/${user.nickname}`}
                      target="_blank"
                    >
                      @{user.nickname}
                    </a>
                  </InfoField>

                  <Group
                    mt={3}
                    direction="row"
                    spacing={2}
                    wrap
                    alignItems="center"
                  >
                    <Button icon={faCopy} onClick={copyAPIToken}>
                      Copy API Token
                    </Button>
                  </Group>
                </Card>
                <RecentEvents />
                <Button
                  color="red"
                  size="medium"
                  icon={faSignOutAlt}
                  onClick={() => logout()}
                >
                  Sign Out
                </Button>
              </Group>
            )
          }}
        </CurrentUserComponent>
      </Container>
    </div>
  )
}

export default withSecurePage(withData(Account))

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
