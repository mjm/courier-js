import { Card as RCard, CardProps } from "@rebass/emotion"

export const PageCard = (props: CardProps) => (
  <RCard
    my="20vh"
    mx="auto"
    bg="white"
    boxShadow="lg"
    borderTop="4px solid"
    borderColor="primary.500"
    p={3}
    pb={5}
    css={{ maxWidth: "600px" }}
    {...props}
  />
)
