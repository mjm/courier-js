import styled from "styled-components"
import {
  FontAwesomeIcon,
  Props as FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome"
import {
  space,
  SpaceProps,
  color,
  ColorProps,
  fontSize,
  FontSizeProps,
} from "styled-system"

type IconProps = FontAwesomeIconProps & SpaceProps & ColorProps & FontSizeProps
const Icon = styled(FontAwesomeIcon)<IconProps>(space, color, fontSize)

export default Icon
