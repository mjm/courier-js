import { createFragmentContainer, graphql, RelayProp } from "react-relay"
import { SubscribeForm_user } from "@generated/SubscribeForm_user.graphql"
import {
  Field,
  Formik,
  Form,
  ErrorMessage,
  FormikHelpers,
  useFormikContext,
} from "formik"
import * as yup from "yup"
import {
  injectStripe,
  CardElement,
  ReactStripeElements,
} from "react-stripe-elements"
import { useRouter } from "next/router"
import { ErrorBox } from "components/ErrorBox"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { subscribe } from "@mutations/Subscribe"
import { FieldError } from "components/FieldError"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { iconForBrand } from "components/CreditCardIcon"
import { theme } from "tailwind.config"
import { useAuth0 } from "components/Auth0Provider"

interface Props {
  user: SubscribeForm_user
  relay: RelayProp
}

const SubscribeForm = injectStripe<Props>(
  ({ user, stripe, relay: { environment } }) => {
    const router = useRouter()
    const { renewSession } = useAuth0()

    const savedCard = user.customer?.creditCard

    async function onSubmit(
      input: SubscribeData,
      actions: FormikHelpers<SubscribeData>
    ): Promise<void> {
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
        validateOnMount
        initialStatus={{ error: null }}
        validationSchema={subscribeSchema}
        onSubmit={onSubmit}
      >
        {({ values, isSubmitting, isValid, setStatus, status: { error } }) => (
          <Form className="px-6 pb-6">
            {savedCard && (
              <>
                <div className="flex flex-row -mx-2 mb-4">
                  <CardChoice
                    icon={iconForBrand(savedCard.brand)}
                    iconLabel={savedCard.lastFour}
                    method="use-saved-card"
                  >
                    Use saved card
                  </CardChoice>
                  <CardChoice icon={faCreditCard} method="new-card">
                    Enter new card
                  </CardChoice>
                </div>
                <ErrorMessage name="method" component={FieldError} />
              </>
            )}
            <div className="flex flex-col">
              {values.method === "use-saved-card" ? null : (
                <>
                  <Field
                    as={TextField}
                    type="text"
                    name="name"
                    placeholder="Name on card"
                  />
                  <ErrorMessage name="name" component={FieldError} />
                  <Field
                    as={TextField}
                    type="email"
                    name="email"
                    placeholder="Email address"
                  />
                  <ErrorMessage name="email" component={FieldError} />
                  <CardInput onChange={() => setStatus({ error: null })} />
                </>
              )}
              <ErrorBox error={error} />
              <button
                className="btn btn-first btn-first-primary self-center text-xl font-medium mt-2 py-2 px-6"
                disabled={!isValid || isSubmitting}
              >
                <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
                Subscribe
              </button>
            </div>
          </Form>
        )}
      </Formik>
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

const CardChoice: React.FC<{
  icon: IconProp
  iconLabel?: React.ReactNode
  method: SubscribeData["method"]
}> = ({ icon, iconLabel, method, children }) => {
  const { setFieldValue, values } = useFormikContext<SubscribeData>()
  const isSelected = values.method === method

  return (
    <div className="w-1/2 px-2 text-sm text-neutral-8">
      <button
        type="button"
        className={`w-full block border rounded-lg p-4 focus:outline-none ${
          isSelected ? "border-primary-3" : "border-neutral-2"
        }`}
        onClick={() => setFieldValue("method", method)}
      >
        <div
          className={`flex flex-col items-center ${
            isSelected ? "text-primary-9" : "text-neutral-9"
          }`}
        >
          <div className="flex items-center mb-1">
            <FontAwesomeIcon
              icon={icon}
              size="2x"
              className={`mr-2 ${
                isSelected ? "text-primary-8" : "text-neutral-8"
              }`}
            />
            <span className="font-bold text-base">{iconLabel}</span>
          </div>
          {children}
        </div>
      </button>
    </div>
  )
}

const TextField: React.FC<React.PropsWithoutRef<
  JSX.IntrinsicElements["input"]
>> = ({ className, ...props }) => {
  return (
    <input
      className={`bg-neutral-1 text-neutral-10 rounded p-3 mb-2 focus:outline-none ${className}`}
      {...props}
    />
  )
}

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

const CardInput: React.FC<ReactStripeElements.ElementProps> = props => (
  <div className="bg-neutral-1 rounded p-3">
    <CardElement
      id="card"
      style={{
        base: {
          fontFamily: "Inter, Helvetica, sans-serif",
          fontSize: "16px",
          color: theme.extend.colors.neutral[10],
          "::placeholder": {
            color: theme.extend.colors.neutral[4],
          },
        },
      }}
      {...props}
    />
  </div>
)
