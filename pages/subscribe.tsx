import React from "react"
import Container from "../components/container"
import withSecurePage from "../hocs/securePage"
import { PageHeader, PageDescription } from "../components/header"
import Head from "../components/head"
import {
  StripeProvider,
  injectStripe,
  CardElement,
  Elements,
} from "react-stripe-elements"
import { ThemeContext } from "@emotion/core"
import Card, { CardHeader, ContentCard } from "../components/card"
import Group from "../components/group"
import { Button } from "../components/button"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"

const Subscribe = () => {
  const [stripe, setStripe] = React.useState<stripe.Stripe | null>(null)
  React.useEffect(() => {
    // @ts-ignore
    setStripe(window.Stripe(process.env.STRIPE_KEY))
  }, [])

  return (
    <StripeProvider stripe={stripe}>
      <Container>
        <Head title="Subscribe to Courier" stripe />
        <PageHeader>Subscribe</PageHeader>
        <PageDescription>
          To be able to post your tweets to Twitter, you'll need to subscribe to
          Courier.
        </PageDescription>

        <Group direction="column" spacing={3}>
          <ContentCard>
            <CardHeader>Subscribing to Courier</CardHeader>
            <p>
              When you subscribe to Courier, you'll be charged{" "}
              <strong>$5 each month</strong>.
            </p>
            <p>
              As long as you are subscribed, you will be able to use Courier to
              manually or automatically post tweets to your Twitter account.
            </p>
            <p>
              You can cancel your subscription at any time. If you do, you'll
              continue to be able to post tweets with Courier for the remainder
              of time you've paid for.
            </p>
          </ContentCard>
          <Elements>
            <SubscribeForm />
          </Elements>
        </Group>
      </Container>
    </StripeProvider>
  )
}

export default withSecurePage(Subscribe)

interface SubscribeFormProps {}
const SubscribeForm = injectStripe<SubscribeFormProps>(({ stripe }) => {
  const [submitting, setSubmitting] = React.useState(false)

  async function subscribe() {
    if (!stripe) {
      return
    }

    setSubmitting(true)
    try {
      const token = await stripe.createToken()
      console.log("subscribe with token", token)
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ThemeContext.Consumer>
      {(theme: any) => (
        <>
          <Card>
            <CardHeader>Card Details</CardHeader>
            <CardElement
              style={{
                base: {
                  fontFamily: theme.fonts.body,
                  fontSize: theme.fontSizes[3],
                  color: theme.colors.primary[800],
                },
                empty: {
                  color: theme.colors.primary[800],
                },
              }}
            />
          </Card>
          <Button
            size="large"
            icon={faCreditCard}
            onClick={subscribe}
            spin={submitting}
            alignSelf="center"
          >
            Subscribe
          </Button>
        </>
      )}
    </ThemeContext.Consumer>
  )
})
