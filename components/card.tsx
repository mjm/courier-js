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
const Card = styled(RCard)<Props>(({ theme }) => ({
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
    color: ${({ theme }) => theme.colors.primary[800]};
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
