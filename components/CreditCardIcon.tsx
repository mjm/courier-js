import { Props, FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import {
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcDiscover,
  faCcDinersClub,
  faCcJcb,
} from "@fortawesome/free-brands-svg-icons"

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
