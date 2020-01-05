import React from "react"
import { NextPage } from "next"
import { StripeProvider, Elements } from "react-stripe-elements"
import Container, { FlushContainer } from "../Container"
import Head from "../Head"
import Group from "../Group"
import { ContentCard, CardHeader } from "../Card"
import withData from "../../hocs/withData"
import withSecurePage from "../../hocs/withSecurePage"
import { graphql } from "react-relay"
import SubscribeForm from "../SubscribeForm"
import PageHeader from "../PageHeader"
import PageDescription from "../PageDescription"
import { SubscribePageQueryResponse } from "../../lib/__generated__/SubscribePageQuery.graphql"

type Props = SubscribePageQueryResponse

const SubscribePage: NextPage<Props> = ({ currentUser }) => {
  const [stripe, setStripe] = React.useState<stripe.Stripe | null>(null)
  React.useEffect(() => {
    setStripe(window.Stripe(process.env.STRIPE_KEY!))
  }, [])

  if (!currentUser) {
    return <></>
  }

  return (
    <StripeProvider stripe={stripe}>
      <Container>
        <Head title="Subscribe to Courier" stripe />

        <PageHeader>Subscribe</PageHeader>
        <PageDescription>
          To be able to post your tweets to Twitter, you'll need to subscribe to
          Courier.
        </PageDescription>

        <FlushContainer>
          <Group direction="column" spacing={3}>
            <ContentCard>
              <CardHeader>Subscribing to Courier</CardHeader>
              <p>
                When you subscribe to Courier, you'll be charged{" "}
                <strong>$5 each month</strong>.
              </p>
              <p>
                As long as you are subscribed, you will be able to use Courier
                to manually or automatically post tweets to your Twitter
                account.
              </p>
              <p>
                You can cancel your subscription at any time. If you do, you'll
                continue to be able to post tweets with Courier for the
                remainder of time you've paid for.
              </p>
            </ContentCard>
            <Elements
              fonts={[
                {
                  cssSrc:
                    "https://fonts.googleapis.com/css?family=IBM+Plex+Sans&display=swap",
                },
              ]}
            >
              <SubscribeForm user={currentUser} />
            </Elements>
          </Group>
        </FlushContainer>
      </Container>
    </StripeProvider>
  )
}

export default withData(withSecurePage(SubscribePage), {
  query: graphql`
    query SubscribePageQuery {
      currentUser {
        ...SubscribeForm_user
      }
    }
  `,
})