import React from "react"
import styled from "styled-components"
import { spacing } from "../utils/theme"
import { Flex, Text } from "rebass"

type InfoFieldProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]> & {
  label: string
}
export const InfoField = ({ label, children, ...props }: InfoFieldProps) => (
  <Text lineHeight="relaxed">
    <Flex {...props}>
      <Text width={180} color="primary.800" fontWeight={500}>
        {label}
      </Text>
      <Text color="gray.900">{children}</Text>
    </Flex>
  </Text>
)

export const InfoTable = styled.table`
  table-layout: fixed;
  width: 100%;
  margin-top: ${spacing(2)};
  white-space: nowrap;
  margin-left: -${spacing(1)};
  margin-right: -${spacing(1)};

  td {
    line-height: 2em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 ${spacing(1)};
  }
`
