import styled from "styled-components"
import { space, SpaceProps } from "styled-system"

type GroupProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]> & {
  direction: "row" | "column"
  spacing: number
} & SpaceProps
const Group = styled.div<GroupProps>`
  ${space};
  display: flex;
  flex-direction: ${({ direction }) => direction};

  ${({ direction, spacing, theme }) => `
  & > * {
    margin-${direction === "row" ? "left" : "top"}: ${theme.space[spacing]};
  }
  & > *:first-child {
    margin-${direction === "row" ? "left" : "top"}: 0;
  }
  `}
`

export default Group
