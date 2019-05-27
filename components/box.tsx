import React from "react"
import styled from "styled-components"
import { spacing, colors, shadow, font } from "../utils/theme"

type BoxProps = React.PropsWithoutRef<JSX.IntrinsicElements["section"]> & {
  appearance?: "normal" | "canceled"
}
const Box = styled.section<BoxProps>`
  padding: ${spacing(4)};
  margin-bottom: ${spacing(4)};
  box-shadow: ${shadow.md};
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  line-height: 1.5em;

  ${({ appearance }) =>
    appearance === "canceled" ? `color: ${colors.gray[700]};` : null}
  background-color: ${({ appearance }) =>
    appearance === "canceled" ? colors.gray[200] : "white"};
  border-top: 3px solid
    ${({ appearance }) =>
      appearance === "canceled" ? colors.gray[400] : colors.primary[500]};

  & a {
    color: ${colors.primary[700]};
  }
`

export default Box

export const BoxHeader = styled.h3`
  font-family: ${font.display};
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  margin-bottom: ${spacing(2)};
  color: ${colors.primary[800]};

  & a {
    color: ${colors.primary[800]};
    text-decoration: none;
  }
`
export const BoxButtons = styled.div`
  margin-top: ${spacing(1)};

  & > * {
    margin-top: ${spacing(3)};
  }
`
