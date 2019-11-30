import { Text, TextProps } from "@rebass/emotion"

const PageDescription = (props: TextProps) => (
  <Text as="p" color="primary.900" textAlign="center" mb={4} {...props} />
)

export default PageDescription
