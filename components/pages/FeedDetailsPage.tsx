import { Environment, graphql } from "react-relay"

import { NextPage } from "next"

import { useFeedOptionsChangedEvent } from "@events/FeedOptionsChangedEvent"
import { useFeedRefreshedEvent } from "@events/FeedRefreshedEvent"
import { FeedDetailsPageQueryResponse } from "@generated/FeedDetailsPageQuery.graphql"
import { ErrorContainer } from "components/ErrorContainer"
import FeedDetails from "components/FeedDetails"
import withData from "hocs/withData"
import withSecurePage from "hocs/withSecurePage"

const FeedDetailsPage: NextPage<
  FeedDetailsPageQueryResponse & { environment: Environment },
  { id: string }
> = ({ feed, viewer, environment }) => {
  useFeedRefreshedEvent(environment)
  useFeedOptionsChangedEvent(environment)

  if (!feed || !viewer) {
    // TODO I think this means there's no such feed
    return <></>
  }

  return (
    <main className="container mx-auto my-8">
      <ErrorContainer>
        <FeedDetails feed={feed} user={viewer} />
      </ErrorContainer>
    </main>
  )
}

FeedDetailsPage.getInitialProps = ({ query }) => {
  return { id: query.id as string }
}

export default withData(withSecurePage(FeedDetailsPage), {
  query: graphql`
    query FeedDetailsPageQuery($id: ID!) {
      feed(id: $id) {
        ...FeedDetails_feed
      }
      viewer {
        ...FeedDetails_user
      }
    }
  `,
  getVariables({ id }) {
    return { id }
  },
})
