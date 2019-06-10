import styled from "styled-components"
import {
  FontAwesomeIcon,
  Props as FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome"
import { space, SpaceProps, color, ColorProps } from "styled-system"

type IconProps = FontAwesomeIconProps & SpaceProps & ColorProps
const Icon = styled(FontAwesomeIcon)<IconProps>`
  ${space}
  ${color}
`

export default Icon