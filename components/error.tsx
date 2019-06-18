import React from "react"
import styled from "@emotion/styled"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { isApolloError } from "apollo-client"
import { Card, CardProps, Flex, Box, Text } from "@rebass/emotion"
import Icon from "./icon"

const ErrorList = styled.ul(({ theme }) => ({
  marginTop: theme.space[2],
  marginBottom: theme.space[1],
  marginLeft: theme.space[2],
  paddingLeft: theme.space[3],
}))

interface ErrorBoxProps extends CardProps {
  error?: Error
  errors?: Error[]
}
export const ErrorBox = ({ error, errors, ...props }: ErrorBoxProps) => {
  errors = errors || []

  if (error) {
    if (isApolloError(error)) {
      errors = [...(errors || []), ...error.graphQLErrors]
    } else {
      errors = [...(errors || []), error]
    }
  }

  if (!errors.length) {
    return null
  }

  return (
    <Card
      role="alert"
      bg="red.100"
      color="red.900"
      p={3}
      width={1}
      borderTop="3px solid"
      borderColor="red.500"
      boxShadow="md"
      {...props}
    >
      <Flex>
        <Icon mr={2} mt="2px" color="red.500" icon={faExclamationCircle} />
        {errors.length > 1 ? (
          <div>
            <Text>There were some issues adding the feed:</Text>
            <ErrorList>
              {errors.map((err: Error, i: number) => (
                <li key={i}>{err.message}</li>
              ))}
            </ErrorList>
          </div>
        ) : (
          <div>{errors[0].message}</div>
        )}
      </Flex>
    </Card>
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
