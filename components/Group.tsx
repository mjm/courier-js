import styled from "@emotion/styled"
import { space, SpaceProps, alignItems, AlignItemsProps } from "styled-system"

type GroupProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]> & {
  direction: "row" | "column"
  spacing: number
  wrap?: boolean
} & SpaceProps &
  AlignItemsProps

const GroupOuter = styled.div<SpaceProps>(space)

const GroupInner = styled.div<GroupProps>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  ${({ wrap }) => (wrap ? "flex-wrap: wrap;" : "")}
  ${alignItems}

  ${({ spacing, theme }: any) => `
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
  alignItems,
  children,
  ...props
}: GroupProps) => {
  return (
    <GroupOuter {...props}>
      <GroupInner
        direction={direction}
        spacing={spacing}
        wrap={wrap}
        alignItems={alignItems}
      >
        {children}
      </GroupInner>
    </GroupOuter>
  )
}

export default Group
