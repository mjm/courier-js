import { createFragmentContainer, graphql } from "react-relay"
import { SubscriptionStatus_user } from "../lib/__generated__/SubscriptionStatus_user.graphql"
import { Text } from "@rebass/emotion"
import Icon from "./icon"
import {
  faCheckCircle,
  faTimesCircle,
  faCalendarTimes,
  faBan,
} from "@fortawesome/free-solid-svg-icons"

interface Props {
  user: SubscriptionStatus_user
}

const SubscriptionStatus: React.FC<Props> = ({ user }) => {
  const status = user.subscription?.status ?? user.subscriptionStatusOverride
  if (!status) {
    return <Text>Not subscribed</Text>
  }

  const override = !!user.subscriptionStatusOverride ? (
    <Text as="span" color="gray.600">
      {" "}
      (Overridden)
    </Text>
  ) : null

  switch (status) {
    case "ACTIVE":
      return (
        <Text>
          <Icon icon={faCheckCircle} mr={1} color="primary.600" />
          Active
          {override}
        </Text>
      )
    case "CANCELED":
      return (
        <Text>
          <Icon icon={faTimesCircle} mr={1} color="gray.600" />
          Canceled
          {override}
        </Text>
      )
    case "EXPIRED":
      return (
        <Text>
          <Icon icon={faCalendarTimes} mr={1} color="red.600" />
          Expired
          {override}
        </Text>
      )
    case "INACTIVE":
      return (
        <Text>
          <Icon icon={faBan} mr={1} color="gray.600" />
          Inactive
          {override}
        </Text>
      )
    default:
      return null
  }
}

export default createFragmentContainer(SubscriptionStatus, {
  user: graphql`
    fragment SubscriptionStatus_user on User {
      subscription {
        status
      }
      subscriptionStatusOverride
    }
  `,
})
