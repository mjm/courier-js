import { Heading, HeadingProps, Text, TextProps } from "rebass"

export const PageHeader = (props: HeadingProps) => (
  <Heading
    as="h1"
    fontSize={8}
    textAlign="center"
    letterSpacing="tight"
    color="primary.900"
    mt={4}
    {...props}
  />
)

export const PageDescription = (props: TextProps) => (
  <Text as="p" color="primary.900" textAlign="center" mb={4} {...props} />
)

export const SectionHeader = (props: HeadingProps) => (
  <Heading
    my={3}
    fontSize={5}
    color="primary.800"
    letterSpacing="tight"
    {...props}
  />
)
