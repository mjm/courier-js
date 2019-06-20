import React, { forwardRef } from "react"
import styled from "@emotion/styled"
import { space, SpaceProps, alignSelf, AlignSelfProps } from "styled-system"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import Icon from "./icon"

type Size = "small" | "medium" | "large"

type StyledButtonProps = React.PropsWithoutRef<
  JSX.IntrinsicElements["button"]
> & {
  size: Size
  color: "primary" | "red" | "blue"
  invert: boolean
} & SpaceProps &
  AlignSelfProps

const colorStyles = ({
  color,
  invert,
  theme,
}: Pick<StyledButtonProps, "color" | "invert"> & { theme: any }) =>
  invert
    ? {
        color: theme.colors[color][600],
        backgroundColor: theme.colors[color][100],
        ":hover": {
          color: theme.colors[color][700],
          backgroundColor: theme.colors[color][200],
        },
      }
    : {
        color: "white",
        backgroundColor: theme.colors[color][600],
        ":hover": {
          backgroundColor: theme.colors[color][500],
        },
      }

const sizes: { [key in Size]: any } = {
  small: ({ theme }: any) => ({
    fontSize: theme.fontSizes[1],
  }),

  medium: ({ theme }: any) => ({
    fontSize: theme.fontSizes[3],
    boxShadow: theme.shadow.md,
  }),

  large: ({ theme }: any) => ({
    padding: `${theme.space[2]} ${theme.space[3]}`,
    fontSize: theme.fontSizes[5],
    boxShadow: theme.shadow.md,
  }),
}

const sizeStyles = (props: { size: Size; theme: any }) =>
  sizes[props.size](props)

const StyledButton = styled.button<StyledButtonProps>(
  space,
  alignSelf,
  ({ theme }: any) => ({
    flexShrink: 0,
    border: 0,
    lineHeight: theme.lineHeights.normal,
    fontWeight: 500,
    borderRadius: "0.5rem",
    boxShadow: theme.shadows.sm,
    outline: "none",
    ":disabled": {
      backgroundColor: `${theme.colors.gray[200]} !important`,
      color: `${theme.colors.gray[500]} !important`,
      cursor: "not-allowed",
    },
  }),
  colorStyles,
  sizeStyles
)

StyledButton.defaultProps = {
  px: 2,
  py: 1,
  alignSelf: "flex-start",
}

type Props = React.PropsWithoutRef<JSX.IntrinsicElements["button"]> & {
  size?: "small" | "medium" | "large"
  color?: "primary" | "red" | "blue"
  invert?: boolean

  icon?: IconDefinition
  spin?: boolean
  useSameIconWhileSpinning?: boolean
} & SpaceProps
export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      disabled,
      size = "small",
      color = "primary",
      invert = false,
      icon,
      spin = false,
      useSameIconWhileSpinning = false,
      ...props
    }: Props,
    ref
  ) => {
    return (
      <StyledButton
        size={size}
        color={color}
        invert={invert}
        ref={ref}
        type="button"
        disabled={disabled || spin}
        {...props}
      >
        {icon && (
          <Icon
            mr={size === "small" ? 1 : 2}
            icon={spin && !useSameIconWhileSpinning ? faSpinner : icon}
            spin={spin}
          />
        )}
        {children}
      </StyledButton>
    )
  }
)
