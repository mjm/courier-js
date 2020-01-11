import { NextPage } from "next"
import withData from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"
import { graphql } from "react-relay"
import { ErrorContainer } from "components/ErrorContainer"
import FeedDetails from "components/FeedDetails"
import { FeedDetailsPageQueryResponse } from "@generated/FeedDetailsPageQuery.graphql"

type Props = FeedDetailsPageQueryResponse & {
  id: string
}

const FeedDetailsPage: NextPage<Props, any> = ({
  subscribedFeed,
  currentUser,
}) => {
  if (!subscribedFeed || !currentUser) {
    // TODO I think this means there's no such feed
    return <></>
  }

  return (
    <main className="container mx-auto my-8">
      <ErrorContainer>
        <FeedDetails feed={subscribedFeed} user={currentUser} />
      </ErrorContainer>
    </main>
  )
}

FeedDetailsPage.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default withData(withSecurePage(FeedDetailsPage), {
  query: graphql`
    query FeedDetailsPageQuery($id: ID!) {
      subscribedFeed(id: $id) {
        ...FeedDetails_feed
      }
      currentUser {
        ...FeedDetails_user
      }
    }
  `,
  getVariables({ id }) {
    return { id }
  },
})
