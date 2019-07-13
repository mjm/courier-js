import React from "react"
import Container, { FlushContainer } from "../components/container"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import { PageHeader, PageDescription } from "../components/header"
import Head from "../components/head"
import {
  StripeProvider,
  injectStripe,
  CardElement,
  Elements,
  ReactStripeElements,
} from "react-stripe-elements"
import { ThemeContext } from "@emotion/core"
import Card, { CardHeader, ContentCard } from "../components/card"
import Group from "../components/group"
import { Button } from "../components/button"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { SubscribeComponent } from "../lib/generated/graphql-components"
import * as yup from "yup"
import { FormikActions, Formik, Form, Field, ErrorMessage } from "formik"
import { ErrorBox, FieldError } from "../components/error"
import { Box } from "@rebass/emotion"
import styled from "@emotion/styled-base"

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
              <SubscribeForm />
            </Elements>
          </Group>
        </FlushContainer>
      </Container>
    </StripeProvider>
  )
}

export default withData(withSecurePage(Subscribe))

const TextField = styled(Field)(({ theme }) => ({
  color: theme.colors.primary[800],
  backgroundColor: theme.colors.gray[100],
  border: 0,
  //borderBottom: `2px solid ${theme.colors.primary[500]}`,
  borderRadius: "0.5rem",
  padding: `${theme.space[2]} ${theme.space[3]}`,
  display: "block",
}))

const subscribeSchema = yup.object().shape({
  email: yup
    .string()
    .required("An email address is needed for sending billing-related emails.")
    .email("This must be a valid email address."),
  name: yup.string().required("A name is needed for credit card validation."),
})
interface SubscribeData {
  email: string
  name: string
}

const initialSubscribeData: SubscribeData = {
  email: "",
  name: "",
}

interface SubscribeFormProps {}
const SubscribeForm = injectStripe<SubscribeFormProps>(({ stripe }) => {
  return (
    <SubscribeComponent>
      {subscribe => {
        async function onSubmit(
          input: SubscribeData,
          actions: FormikActions<SubscribeData>
        ) {
          if (!stripe) {
            return
          }

          try {
            const { token, error } = await stripe.createToken({
              name: input.name,
            })
            if (token) {
              await subscribe({
                variables: {
                  input: {
                    tokenID: token.id,
                    email: input.email,
                  },
                },
              })
            } else {
              console.error(error)
              actions.setStatus({ error })
            }
          } catch (error) {
            console.error(error)
            actions.setStatus({ error })
          } finally {
            actions.setSubmitting(false)
          }
        }

        return (
          <Formik
            initialValues={initialSubscribeData}
            initialStatus={{ error: null }}
            validationSchema={subscribeSchema}
            onSubmit={onSubmit}
            render={({
              isSubmitting,
              isValid,
              setStatus,
              status: { error },
            }) => (
              <Form>
                <Group direction="column" spacing={3}>
                  <Card>
                    <CardHeader>Payment Details</CardHeader>
                    <Group direction="column" spacing={2}>
                      <TextField
                        type="text"
                        name="name"
                        placeholder="Name on card"
                      />
                      <ErrorMessage name="name" component={FieldError} />
                      <TextField
                        type="email"
                        name="email"
                        placeholder="Email address"
                      />
                      <ErrorMessage name="email" component={FieldError} />
                      <CardInput onChange={() => setStatus({ error: null })} />
                    </Group>
                  </Card>
                  <ErrorBox error={error} />
                  <Button
                    size="large"
                    type="submit"
                    icon={faCreditCard}
                    spin={isSubmitting}
                    alignSelf="center"
                    disabled={!isValid}
                  >
                    Subscribe
                  </Button>
                </Group>
              </Form>
            )}
          />
        )
      }}
    </SubscribeComponent>
  )
})

interface CardInputProps extends ReactStripeElements.ElementProps {}
const CardInput = (props: CardInputProps) => (
  <Box py={2} px={3} bg="gray.100" css={{ borderRadius: "0.5rem" }}>
    <ThemeContext.Consumer>
      {(theme: any) => (
        <CardElement
          id="card"
          style={{
            base: {
              fontFamily: theme.fonts.body,
              fontSize: theme.fontSizes[3],
              color: theme.colors.primary[800],
            },
          }}
          {...props}
        />
      )}
    </ThemeContext.Consumer>
  </Box>
)
