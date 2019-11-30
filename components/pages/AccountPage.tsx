import { NextPage } from "next"
import Container, { FlushContainer } from "../Container"
import Head from "../Head"
import Group from "../Group"
import { Button } from "../Button"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { logout } from "../../utils/auth0"
import withData from "../../hocs/relay"
import withSecurePage from "../../hocs/securePage"
import { graphql } from "react-relay"
import UserInfoCard from "../UserInfoCard"
import SubscriptionInfoCard from "../SubscriptionInfoCard"
import RecentEventsCard from "../RecentEventsCard"
import PageHeader from "../PageHeader"
import { AccountPageQueryResponse } from "../../lib/__generated__/AccountPageQuery.graphql"

type Props = AccountPageQueryResponse
const AccountPage: NextPage<Props> = props => {
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

export default withData(withSecurePage(AccountPage), {
  query: graphql`
    query AccountPageQuery {
      currentUser {
        ...UserInfoCard_user
        ...SubscriptionInfoCard_user
      }
      ...RecentEventsCard_events
    }
  `,
})
