import styled from "styled-components"
import { space, SpaceProps } from "styled-system"

type GroupProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]> & {
  direction: "row" | "column"
  spacing: number
  wrap?: boolean
} & SpaceProps

const GroupOuter = styled.div<SpaceProps>`
  ${space};
`

const GroupInner = styled.div<GroupProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  ${({ wrap }) => (wrap ? "flex-wrap: wrap;" : "")}

  ${({ spacing, theme }) => `
  margin: -${theme.space[spacing - 1]};
  & > * {
    margin: ${theme.space[spacing - 1]};
  }
  `}
`

const Group = ({
  direction,
  spacing,
  wrap,
  children,
  ...props
}: GroupProps) => {
  return (
    <GroupOuter {...props}>
      <GroupInner direction={direction} spacing={spacing} wrap={wrap}>
        {children}
      </GroupInner>
    </GroupOuter>
  )
}

export default Group
