import React from "react"
import styled from "@emotion/styled"
import { Flex, Text } from "@rebass/emotion"

type InfoFieldProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]> & {
  label: string
}
export const InfoField = ({ label, children, ...props }: InfoFieldProps) => (
  <Text lineHeight="relaxed">
    <Flex {...props}>
      <Text
        width={[120, 180]}
        color="primary.800"
        fontWeight={500}
        css={{ flexShrink: 0 }}
      >
        {label}
      </Text>
      <Text color="gray.900">{children}</Text>
    </Flex>
  </Text>
)

export const InfoTable = styled.table(({ theme }: any) => ({
  tableLayout: "fixed",
  width: "100%",
  marginTop: theme.space[2],
  whiteSpace: "nowrap",
  marginLeft: `-${theme.space[1]}`,
  marginRight: `-${theme.space[1]}`,
  td: {
    lineHeight: theme.lineHeights.loose,
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: `0 ${theme.space[1]}`,
  },
}))
