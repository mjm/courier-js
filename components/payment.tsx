import React from "react"
import {
  CreditCard as CreditCardData,
  SubscriptionStatus as Status,
} from "../lib/generated/graphql-components"
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
}
export const SubscriptionStatus = ({ status }: SubscriptionStatusProps) => {
  if (!status) {
    return <Text>Not subscribed</Text>
  }

  switch (status) {
    case Status.Active:
      return (
        <Text>
          <Icon icon={faCheckCircle} mr={1} color="primary.600" />
          Active
        </Text>
      )
    case Status.Canceled:
      return (
        <Text>
          <Icon icon={faTimesCircle} mr={1} color="gray.600" />
          Canceled
        </Text>
      )
    case Status.Expired:
      return (
        <Text>
          <Icon icon={faCalendarTimes} mr={1} color="red.600" />
          Expired
        </Text>
      )
    case Status.Inactive:
      return (
        <Text>
          <Icon icon={faBan} mr={1} color="gray.600" />
          Inactive
        </Text>
      )
    default:
      return null
  }
}
