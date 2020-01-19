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
import { FontAwesomeIcon,Props } from "@fortawesome/react-fontawesome"

const CreditCardIcon: React.FC<Omit<Props, "icon"> & {
  brand: string
}> = ({ brand, ...props }) => {
  const icon = iconForBrand(brand)
  return <FontAwesomeIcon icon={icon} {...props} />
}

export default CreditCardIcon

const creditCardsByBrand: { [key: string]: IconDefinition } = {
  Visa: faCcVisa,
  MasterCard: faCcMastercard,
  "American Express": faCcAmex,
  Discover: faCcDiscover,
  "Diners Club": faCcDinersClub,
  JCB: faCcJcb,
}

export function iconForBrand(brand: string): IconDefinition {
  return creditCardsByBrand[brand] || faCreditCard
}
