import React from "react"
import { Card, CardProps, Flex } from "@rebass/emotion"
import {
  faExclamationCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"
import Icon from "./icon"

const variants = {
  error: { color: "red", icon: faExclamationCircle },
  warning: { color: "yellow", icon: faExclamationTriangle },
}

interface NoticeProps extends CardProps {
  variant?: "error" | "warning"
}
const Notice = ({ variant = "warning", children, ...props }: NoticeProps) => {
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
        <div>{children}</div>
      </Flex>
    </Card>
  )
}

export default Notice
