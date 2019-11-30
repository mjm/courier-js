import { Box } from "@rebass/emotion"
import Icon from "./icon"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"

interface Props {
  children?: React.ReactNode
}

export const FieldError: React.FC<Props> = ({ children }) => {
  return (
    <Box color="red.900" mb={3}>
      <Icon mr={2} mt="2px" color="red.500" icon={faExclamationCircle} />
      {children}
    </Box>
  )
}
