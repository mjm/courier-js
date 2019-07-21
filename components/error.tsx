import React from "react"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { isApolloError } from "apollo-client"
import { CardProps, Box, Text } from "@rebass/emotion"
import Icon from "./icon"
import Notice from "./notice"
import { useErrors } from "../hooks/error"

interface ErrorBoxProps extends CardProps {
  error?: Error
  errors?: Error[]
}
export const ErrorBox = ({ error, errors, ...props }: ErrorBoxProps) => {
  // pull errors from the ErrorContainer if none are passed in
  const { errors: ctxErrors, clearErrors } = useErrors()
  let onClose: undefined | (() => void)

  if (ctxErrors && !errors) {
    errors = ctxErrors
    onClose = clearErrors
  } else {
    errors = errors || []

    if (error) {
      if (isApolloError(error)) {
        errors = [...(errors || []), ...error.graphQLErrors]
      } else {
        errors = [...(errors || []), error]
      }
    }
  }

  if (!errors.length) {
    return null
  }

  return (
    <Notice {...props} variant="error" onClose={onClose}>
      {errors.length > 1 ? (
        <>
          <Text>There were some issues adding the feed:</Text>
          <Box as="ul" mt={2} mb={1} ml={2} pl={3}>
            {errors.map((err: Error, i: number) => (
              <li key={i}>{err.message}</li>
            ))}
          </Box>
        </>
      ) : (
        errors[0].message
      )}
    </Notice>
  )
}

interface FieldErrorProps {
  children?: React.ReactNode
}
export const FieldError = ({ children }: FieldErrorProps) => {
  return (
    <Box color="red.900" mb={3}>
      <Icon mr={2} mt="2px" color="red.500" icon={faExclamationCircle} />
      {children}
    </Box>
  )
}
