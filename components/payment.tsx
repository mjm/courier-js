import React from "react"
import { CreditCard as CreditCardData } from "../lib/generated/graphql-components"
import { Text } from "@rebass/emotion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcDiscover,
  faCcDinersClub,
  faCcJcb,
} from "@fortawesome/free-brands-svg-icons"
import { faCreditCard, IconDefinition } from "@fortawesome/free-solid-svg-icons"

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
        <FontAwesomeIcon icon={icon} size="lg" />
      </span>
      <Text as="span" ml={1}>
        •••• {card.lastFour}
      </Text>
    </Text>
  )
}
