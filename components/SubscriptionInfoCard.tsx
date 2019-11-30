import { useRouter } from "next/router"
import Card, { CardHeader } from "./Card"
import Moment from "react-moment"
import Group from "./Group"
import { Button } from "./Button"
import { faCreditCard, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import {
  createFragmentContainer,
  graphql,
  RelayProp,
  Environment,
} from "react-relay"
import { SubscriptionInfoCard_user } from "../lib/__generated__/SubscriptionInfoCard_user.graphql"
import { cancelSubscription } from "../lib/mutations/CancelSubscription"
import CreditCard from "./CreditCard"
import SubscriptionStatus from "./SubscriptionStatus"
import InfoField from "./InfoField"

interface Props {
  user: SubscriptionInfoCard_user
  relay: RelayProp
}

const SubscriptionInfoCard: React.FC<Props> = ({
  user,
  relay: { environment },
}) => {
  const router = useRouter()
  const { customer, subscription, subscriptionStatusOverride } = user

  return (
    <Card>
      <CardHeader>Subscription</CardHeader>
      {subscription ? (
        <>
          <InfoField label="Status">
            <SubscriptionStatus user={user} />
          </InfoField>
          {subscription.status === "ACTIVE" ? (
            <InfoField label="Renews">
              <Moment format="LL">{subscription.periodEnd}</Moment> (
              <Moment fromNow>{subscription.periodEnd}</Moment>)
            </InfoField>
          ) : subscription.status === "CANCELED" ? (
            <InfoField label="Expires">
              <Moment format="LL">{subscription.periodEnd}</Moment> (
              <Moment fromNow>{subscription.periodEnd}</Moment>)
            </InfoField>
          ) : null}
        </>
      ) : (
        <InfoField label="Status">
          <SubscriptionStatus user={user} />
        </InfoField>
      )}
      {customer && customer.creditCard ? (
        <InfoField label="Payment">
          <CreditCard card={customer.creditCard} />
        </InfoField>
      ) : null}
      {subscriptionStatusOverride ? null : (
        <Group mt={3} direction="row" spacing={2} wrap>
          {subscription ? (
            subscription.status === "ACTIVE" ? (
              <CancelButton environment={environment} />
            ) : (
              <Button
                icon={faCreditCard}
                onClick={() => router.push("/subscribe")}
              >
                Resubscribe
              </Button>
            )
          ) : (
            <Button
              icon={faCreditCard}
              onClick={() => router.push("/subscribe")}
            >
              Subscribe
            </Button>
          )}
        </Group>
      )}
    </Card>
  )
}

export default createFragmentContainer(SubscriptionInfoCard, {
  user: graphql`
    fragment SubscriptionInfoCard_user on User {
      customer {
        creditCard {
          ...CreditCard_card
        }
      }
      subscription {
        status
        periodEnd
      }
      subscriptionStatusOverride
      ...SubscriptionStatus_user
    }
  `,
})

interface CancelButtonProps {
  environment: Environment
}

const CancelButton: React.FC<CancelButtonProps> = ({ environment }) => {
  return (
    <Button
      icon={faTimesCircle}
      color="red"
      invert
      onClickAsync={async () => {
        try {
          await cancelSubscription(environment)
        } catch (err) {
          console.error(err)
        }
      }}
    >
      Cancel
    </Button>
  )
}
