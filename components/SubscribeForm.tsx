import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { SubscribeForm_user } from "../lib/__generated__/SubscribeForm_user.graphql"
import styled from "@emotion/styled"
import {
  Field,
  Formik,
  Form,
  FieldProps,
  ErrorMessage,
  FormikActions,
} from "formik"
import * as yup from "yup"
import {
  injectStripe,
  CardElement,
  ReactStripeElements,
} from "react-stripe-elements"
import { useRouter } from "next/router"
import Group from "./group"
import Card, { CardHeader } from "./card"
import { Flex, Box } from "@rebass/emotion"
import { ThemeContext } from "@emotion/core"
import { FieldError, ErrorBox } from "./error"
import { Button } from "./button"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { subscribe } from "../lib/mutations/Subscribe"
import { renewSession } from "../utils/auth0"

interface Props {
  user: SubscribeForm_user
  relay: RelayProp
}

const SubscribeForm = injectStripe<Props>(
  ({ user, stripe, relay: { environment } }) => {
    const router = useRouter()

    const savedCard = user.customer?.creditCard

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

          await subscribe(environment, {
            tokenID: token!.id,
            email: input.email,
          })
        } else {
          // reuse the existing customer
          await subscribe(environment)
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
                          label={`Use saved credit card (${savedCard.brand} ${savedCard.lastFour})`}
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
                      <ErrorMessage name="method" component={FieldError} />
                    </>
                  )}
                  {values.method === "use-saved-card" ? null : (
                    <>
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
  }
)

export default createFragmentContainer(SubscribeForm, {
  user: graphql`
    fragment SubscribeForm_user on User {
      customer {
        creditCard {
          brand
          lastFour
          expirationMonth
          expirationYear
        }
      }
    }
  `,
})

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
        .required("An email address is needed to send billing-related emails."),
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
