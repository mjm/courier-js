import styled from "@emotion/styled"
import { BoxProps, Box } from "@rebass/emotion"
import { maxWidth, MaxWidthProps } from "styled-system"

const MaxWidthBox = styled(Box)<BoxProps & MaxWidthProps>(maxWidth)

type Props = Omit<BoxProps & MaxWidthProps, "ref">
const Container = (props: Props) => (
  <MaxWidthBox
    width={1}
    maxWidth={[null, 640, 768]}
    mx="auto"
    pt={0}
    px={3}
    pb={6}
    {...props}
  />
)

export default Container

export const FlushContainer = (props: BoxProps) => (
  <Box mx={[-3, 0]} {...props} />
)
