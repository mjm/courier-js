import styled from "@emotion/styled"
import {
  Card as RCard,
  CardProps,
  Heading,
  HeadingProps,
} from "@rebass/emotion"

type Props = CardProps & {
  appearance?: "normal" | "canceled"
}
const Card = styled(RCard)<Props>(({ theme }: any) => ({
  borderBottomLeftRadius: theme.space[1],
  borderBottomRightRadius: theme.space[1],
  lineHeight: theme.lineHeights.normal,
  a: {
    color: theme.colors.primary[700],
  },
}))

Card.defaultProps = {
  variant: "normal",
  p: 3,
  boxShadow: "md",
}

export default Card

export const CardHeader = styled(Heading)<HeadingProps>`
  a {
    color: ${({ theme }: any) => theme.colors.primary[800]};
    text-decoration: none;
  }
`

CardHeader.defaultProps = {
  as: "h3",
  fontWeight: 500,
  m: 0,
  mb: 2,
  color: "primary.800",
}

export const ContentCard = styled(Card)(({ theme }: any) => ({
  lineHeight: theme.lineHeights.relaxed,
  "p, ul": {
    marginTop: theme.space[2],
    marginBottom: 0,
    ":first-child": {
      marginTop: 0,
    },
  },
  h2: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.primary[800],
    fontWeight: 500,
    fontFamily: theme.fonts.display,
    marginBottom: 0,
  },
}))

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
