import { IconDefinition, faCreditCard } from "@fortawesome/free-solid-svg-icons"
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcDiscover,
  faCcDinersClub,
  faCcJcb,
} from "@fortawesome/free-brands-svg-icons"
import Icon from "./Icon"
import { Text } from "@rebass/emotion"
import { createFragmentContainer, graphql } from "react-relay"
import { CreditCard_card } from "../lib/__generated__/CreditCard_card.graphql"

interface Props {
  card: CreditCard_card
}

const CreditCard: React.FC<Props> = ({ card }) => {
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

export default createFragmentContainer(CreditCard, {
  card: graphql`
    fragment CreditCard_card on CreditCard {
      brand
      lastFour
      expirationMonth
      expirationYear
    }
  `,
})

const creditCardsByBrand: { [key: string]: IconDefinition } = {
  Visa: faCcVisa,
  MasterCard: faCcMastercard,
  "American Express": faCcAmex,
  Discover: faCcDiscover,
  "Diners Club": faCcDinersClub,
  JCB: faCcJcb,
}
