import React from "react"

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import {
  faCcAmex,
  faCcDinersClub,
  faCcDiscover,
  faCcJcb,
  faCcMastercard,
  faCcVisa,
} from "@fortawesome/free-brands-svg-icons"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome"

const CreditCardIcon: React.FC<Omit<FontAwesomeIconProps, "icon"> & {
  brand: string
}> = ({ brand, ...props }) => {
  const icon = iconForBrand(brand)
  return <FontAwesomeIcon icon={icon} {...props} />
}

export default CreditCardIcon

const creditCardsByBrand: { [key: string]: IconDefinition } = {
  Visa: faCcVisa,
  visa: faCcVisa,
  MasterCard: faCcMastercard,
  mastercard: faCcMastercard,
  "American Express": faCcAmex,
  amex: faCcAmex,
  Discover: faCcDiscover,
  discover: faCcDiscover,
  "Diners Club": faCcDinersClub,
  diners: faCcDinersClub,
  JCB: faCcJcb,
  jcb: faCcJcb,
}

export function iconForBrand(brand: string): IconDefinition {
  return creditCardsByBrand[brand] || faCreditCard
}
