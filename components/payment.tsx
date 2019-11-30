import React from "react"
import { CreditCard as CreditCardData } from "../lib/generated/graphql-components"
import { Text } from "@rebass/emotion"
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcDiscover,
  faCcDinersClub,
  faCcJcb,
} from "@fortawesome/free-brands-svg-icons"
import {
  faCreditCard,
  IconDefinition,
  faCheckCircle,
  faTimesCircle,
  faCalendarTimes,
  faBan,
} from "@fortawesome/free-solid-svg-icons"
import Icon from "./icon"
import { SubscriptionStatus as Status } from "../lib/__generated__/SubscriptionInfoCard_user.graphql"

const creditCardsByBrand: { [key: string]: IconDefinition } = {
  Visa: faCcVisa,
  MasterCard: faCcMastercard,
  "American Express": faCcAmex,
  Discover: faCcDiscover,
  "Diners Club": faCcDinersClub,
  JCB: faCcJcb,
}

interface CreditCardProps {
  card: Pick<CreditCardData, "brand" | "lastFour">
}
export const CreditCard = ({ card }: CreditCardProps) => {
  const icon = creditCardsByBrand[card.brand] || faCreditCard
  return (
    <Text>
      <span title={card.brand}>
        <Icon icon={icon} size="lg" mr={1} />
      </span>
      •••• {card.lastFour}
    </Text>
  )
}

interface SubscriptionStatusProps {
  status?: Status
  overridden?: boolean
}
export const SubscriptionStatus = ({
  status,
  overridden = false,
}: SubscriptionStatusProps) => {
  if (!status) {
    return <Text>Not subscribed</Text>
  }

  const override = overridden ? (
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
