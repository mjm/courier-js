import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface Props {
  children?: React.ReactNode
}

export const FieldError: React.FC<Props> = ({ children }) => {
  return (
    <div className="mb-4 text-red-10 flex items-center">
      <FontAwesomeIcon icon={faExclamationCircle} className="text-red-6 mr-2" />
      {children}
    </div>
  )
}
