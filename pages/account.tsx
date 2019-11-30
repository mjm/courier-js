import { NextPage } from "next"
import Container, { FlushContainer } from "../components/container"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import Group from "../components/group"
import { Button } from "../components/button"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { logout } from "../utils/auth0"
import withData from "../hocs/relay"
import withSecurePage from "../hocs/securePage"
import { graphql } from "react-relay"
import UserInfoCard from "../components/UserInfoCard"
import { accountQueryResponse } from "../lib/__generated__/accountQuery.graphql"
import SubscriptionInfoCard from "../components/SubscriptionInfoCard"
import RecentEventsCard from "../components/RecentEventsCard"

type Props = accountQueryResponse
const Account: NextPage<Props> = props => {
  const { currentUser } = props
  return (
    <Container>
      <Head title="Your Account" />

      <PageHeader mb={4}>Your Account</PageHeader>
      <FlushContainer>
        <Group direction="column" spacing={3}>
          {currentUser && (
            <>
              <UserInfoCard user={currentUser} />
              <SubscriptionInfoCard user={currentUser} />
            </>
          )}
          <RecentEventsCard events={props} />
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

export default withData(withSecurePage(Account), {
  query: graphql`
    query accountQuery {
      currentUser {
        ...UserInfoCard_user
        ...SubscriptionInfoCard_user
      }
      ...RecentEventsCard_events
    }
  `,
})
