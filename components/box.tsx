import styled from "styled-components"
import {
  space,
  color,
  layout,
  shadow,
  SpaceProps,
  ColorProps,
  LayoutProps,
  BoxShadowProps,
} from "styled-system"
import { spacing, colors, font } from "../utils/theme"

const Box = styled.div`
  ${space}
  ${color}
  ${layout}
  ${shadow}
`
export type BoxProps = React.PropsWithoutRef<JSX.IntrinsicElements["section"]> &
  SpaceProps &
  ColorProps &
  LayoutProps &
  BoxShadowProps

export default Box

export const BoxHeader = styled.h3`
  font-family: ${font.display};
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  margin-bottom: ${spacing(2)};
  color: ${colors.primary[800]};

  a {
    color: ${colors.primary[800]};
    text-decoration: none;
  }
`
