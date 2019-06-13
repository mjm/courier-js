import React, { forwardRef } from "react"
import styled, { css } from "styled-components"
import { space, SpaceProps, flexbox, FlexboxProps } from "styled-system"
import { colors, spacing, shadow } from "../utils/theme"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

// get a styled component to refer to in StyledButton
const ButtonIcon = styled(FontAwesomeIcon)``

type StyledButtonProps = React.PropsWithoutRef<
  JSX.IntrinsicElements["button"]
> & {
  size: "small" | "medium" | "large"
  color: "primary" | "red" | "blue"
  invert: boolean
} & SpaceProps &
  FlexboxProps
const StyledButton = styled.button<StyledButtonProps>`
  ${space}
  ${flexbox}
  border: 0;
  line-height: 1.5em;
  font-weight: 500;
  border-radius: 0.6rem;
  box-shadow: ${shadow.sm};
  outline: none;

  :disabled {
    background-color: ${colors.gray[200]} !important;
    color: ${colors.gray[500]} !important;
    cursor: not-allowed;
  }

  ${ButtonIcon} {
    margin-right: ${spacing(2)};
  }

  ${({ size }) => sizeStyles[size]}
  ${({ color, invert }) => `
    color: ${invert ? colors[color][600] : "white"};
    background-color: ${invert ? colors[color][100] : colors[color][600]};

    :hover {
      color: ${invert ? colors[color][700] : "white"};
      background-color: ${invert ? colors[color][200] : colors[color][500]};
    }
  `}
`

StyledButton.defaultProps = {
  px: 2,
  py: 1,
  flexShrink: 0,
  alignSelf: "flex-start",
}

const sizeStyles = {
  small: css`
    font-size: 0.9rem;

    ${ButtonIcon} {
      margin-right: ${spacing(1)};
    }
  `,
  medium: css`
    font-size: 1.2rem;
    box-shadow: ${shadow.md};
  `,
  large: css`
    padding: ${spacing(2)} ${spacing(4)};
    font-size: 1.4rem;
    box-shadow: ${shadow.md};
  `,
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
          <ButtonIcon
            icon={spin && !useSameIconWhileSpinning ? faSpinner : icon}
            spin={spin}
          />
        )}
        {children}
      </StyledButton>
    )
  }
)
