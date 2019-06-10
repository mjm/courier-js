import styled from "styled-components"
import Box, { BoxProps } from "./box"

type CardProps = BoxProps & {
  appearance?: "normal" | "canceled"
}
const Card = styled(Box)<CardProps>`
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
