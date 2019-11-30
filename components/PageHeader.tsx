import { Heading, HeadingProps } from "@rebass/emotion"

const PageHeader = (props: HeadingProps) => (
  <Heading
    as="h1"
    fontSize={[6, 8]}
    textAlign="center"
    letterSpacing="tight"
    color="primary.900"
    mt={4}
    {...props}
  />
)

export default PageHeader
