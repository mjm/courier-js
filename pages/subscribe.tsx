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
import {
  SubscribeComponent,
  SavedPaymentMethodComponent,
} from "../lib/generated/graphql-components"
import * as yup from "yup"
import {
  FormikActions,
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldProps,
} from "formik"
import { ErrorBox, FieldError } from "../components/error"
import { Box, Flex } from "@rebass/emotion"
import styled from "@emotion/styled-base"
import { useRouter } from "next/router"
import { renewSession } from "../utils/auth0"
import Loading from "../components/loading"

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
    .email("This must be a valid email address.")
    .when("method", {
      is: m => m === "new-card",
      then: yup
        .string()
        .required(
          "An email address is needed for sending billing-related emails."
        ),
    }),
  name: yup.string().when("method", {
    is: m => m === "new-card",
    then: yup.string().required("A name is needed for credit card validation."),
  }),
  method: yup.string().oneOf(["use-saved-card", "new-card"]),
})

interface SubscribeData {
  email: string
  name: string
  method: "use-saved-card" | "new-card"
}

const initialSubscribeData: SubscribeData = {
  email: "",
  name: "",
  method: "new-card",
}

interface SubscribeFormProps {}
const SubscribeForm = injectStripe<SubscribeFormProps>(({ stripe }) => {
  const router = useRouter()

  return (
    <SavedPaymentMethodComponent fetchPolicy="cache-and-network">
      {({ data, loading, error }) => {
        if (loading && !(data && data.currentUser)) {
          return <Loading />
        }

        if (error) {
          console.error(error)
          // no return, continue on as though we loaded and just didn't have any
        }

        // wtb optional chaining in JS
        const savedCard =
          data &&
          data.currentUser &&
          data.currentUser.customer &&
          data.currentUser.customer.creditCard

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
                  if (input.method === "new-card") {
                    const { token, error } = await stripe.createToken({
                      name: input.name,
                    })
                    if (error) {
                      throw error
                    }

                    await subscribe({
                      variables: {
                        input: {
                          tokenID: token!.id,
                          email: input.email,
                        },
                      },
                    })
                  } else {
                    // reuse the existing customer
                    await subscribe({
                      variables: { input: {} },
                    })
                  }

                  // ensure we have an up-to-date token, since that's where the
                  // user info on the account page comes from
                  await renewSession()

                  router.push("/account")
                } catch (error) {
                  actions.setStatus({ error })
                } finally {
                  actions.setSubmitting(false)
                }
              }

              return (
                <Formik
                  initialValues={{
                    ...initialSubscribeData,
                    method: savedCard ? "use-saved-card" : "new-card",
                  }}
                  isInitialValid={!!savedCard}
                  initialStatus={{ error: null }}
                  validationSchema={subscribeSchema}
                  onSubmit={onSubmit}
                  render={({
                    values,
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
                            {savedCard && (
                              <>
                                <Flex flexWrap="wrap">
                                  <Field
                                    type="radio"
                                    name="method"
                                    value="use-saved-card"
                                    label={`Use saved credit card (${
                                      savedCard.brand
                                    } ${savedCard.lastFour})`}
                                    component={RadioButton}
                                  />
                                  <Field
                                    type="radio"
                                    name="method"
                                    value="new-card"
                                    label="Enter new credit card"
                                    component={RadioButton}
                                  />
                                </Flex>
                                <ErrorMessage
                                  name="method"
                                  component={FieldError}
                                />
                              </>
                            )}
                            {values.method === "use-saved-card" ? null : (
                              <>
                                <TextField
                                  type="text"
                                  name="name"
                                  placeholder="Name on card"
                                />
                                <ErrorMessage
                                  name="name"
                                  component={FieldError}
                                />
                                <TextField
                                  type="email"
                                  name="email"
                                  placeholder="Email address"
                                />
                                <ErrorMessage
                                  name="email"
                                  component={FieldError}
                                />
                                <CardInput
                                  onChange={() => setStatus({ error: null })}
                                />
                              </>
                            )}
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
      }}
    </SavedPaymentMethodComponent>
  )
})

interface RadioButtonProps extends FieldProps {
  label: React.ReactNode
}
const RadioButton = ({ field, form, label, ...props }: RadioButtonProps) => {
  return (
    <Flex as="label" alignItems="baseline" mr={3}>
      <input
        type="radio"
        checked={field.value === form.values[field.name]}
        {...field}
        {...props}
        css={theme => ({ marginRight: theme.space[2] })}
      />
      {label}
    </Flex>
  )
}

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
