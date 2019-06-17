import styled from "styled-components"
import { BoxProps, Box } from "rebass"
import { maxWidth, MaxWidthProps } from "styled-system"

const MaxWidthBox = styled(Box)<BoxProps & MaxWidthProps>(maxWidth)
type MaxWidthBoxProps = React.ComponentProps<typeof MaxWidthBox>

const Container = (props: MaxWidthBoxProps) => (
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
