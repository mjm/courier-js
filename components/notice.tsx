import React from "react"
import { Card, CardProps, Flex, Button } from "@rebass/emotion"
import {
  faExclamationCircle,
  faExclamationTriangle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons"
import Icon from "./icon"

const variants = {
  error: { color: "red", icon: faExclamationCircle },
  warning: { color: "yellow", icon: faExclamationTriangle },
}

interface NoticeProps extends CardProps {
  variant?: "error" | "warning"
  onClose?: () => void
}
const Notice = ({
  variant = "warning",
  onClose,
  children,
  ...props
}: NoticeProps) => {
  const { color, icon } = variants[variant]
  return (
    <Card
      role="alert"
      bg={`${color}.100`}
      color={`${color}.900`}
      p={3}
      width={1}
      borderTop="3px solid"
      borderColor={`${color}.500`}
      boxShadow="md"
      {...props}
    >
      <Flex>
        <Icon mr={2} mt="2px" color={`${color}.500`} icon={icon} />
        <div css={{ flexGrow: 1 }}>{children}</div>
        {onClose && (
          <Button
            onClick={onClose}
            color={`${color}.500`}
            fontWeight={400}
            bg="transparent"
            px={0}
            py={0}
          >
            <Icon icon={faTimesCircle} />
          </Button>
        )}
      </Flex>
    </Card>
  )
}

export default Notice
