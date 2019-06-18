import styled from "@emotion/styled"
import { boxShadow, BoxShadowProps } from "styled-system"
import { Box, BoxProps, Heading, HeadingProps } from "@rebass/emotion"

type CardProps = BoxProps &
  BoxShadowProps & {
    appearance?: "normal" | "canceled"
  }
const Card = styled(Box)<CardProps>`
  ${boxShadow}
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  line-height: 1.5em;

  ${({ appearance, theme }) =>
    appearance === "canceled"
      ? `
  color: ${theme.colors.gray[700]};
  background-color: ${theme.colors.gray[200]};
  border-top: 3px solid ${theme.colors.gray[400]};
  `
      : `
  background-color: white;
  border-top: 3px solid ${theme.colors.primary[500]};
  `}

  a {
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`

Card.defaultProps = {
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
