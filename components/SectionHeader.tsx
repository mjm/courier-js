import { Heading, HeadingProps } from "@rebass/emotion"

const SectionHeader = (props: HeadingProps) => (
  <Heading
    my={3}
    fontSize={[4, 5]}
    color="primary.800"
    letterSpacing="tight"
    {...props}
  />
)

export default SectionHeader
