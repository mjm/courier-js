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
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { logout } from "../utils/auth0"
import Moment from "react-moment"

const Account = () => {
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
          if (loading) {
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
  switch (event.eventType) {
    case EventType.FeedSetAutopost:
      return (
        <>
          You turned {event.boolValue ? "on" : "off"} autoposting for "
          {feedTitle}"
        </>
      )
    case EventType.FeedRefresh:
      return <>You refreshed "{feedTitle}"</>
    case EventType.FeedSubscribe:
      return <>You subscribed to "{feedTitle}"</>
    case EventType.FeedUnsubscribe:
      return <>You unsubscribed from "{feedTitle}"</>
    case EventType.TweetCancel:
      return <>You canceled a draft tweet.</>
    case EventType.TweetUncancel:
      return <>You turned a canceled tweet back into a draft.</>
    case EventType.TweetEdit:
      return <>You edited a draft tweet.</>
  }
}
