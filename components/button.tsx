import React, { forwardRef } from "react"
import { colors, spacing, shadow } from "../utils/theme"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

type Props = React.PropsWithoutRef<JSX.IntrinsicElements["button"]> & {
  size?: "small" | "medium" | "large"
  color?: "primary" | "red" | "blue"
  invert?: boolean

  icon?: IconDefinition
  spin?: boolean
  useSameIconWhileSpinning?: boolean
}
export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      className = "",
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
      <button
        ref={ref}
        className={`${size} ${className}`}
        type="button"
        disabled={disabled || spin}
        {...props}
      >
        {icon && (
          <FontAwesomeIcon
            className="icon"
            icon={spin && !useSameIconWhileSpinning ? faSpinner : icon}
            spin={spin}
          />
        )}
        {children}
        <style jsx>{`
          button {
            flex-shrink: 0;
            border: 0;
            padding: ${spacing(1)} ${spacing(3)};
            line-height: 1.5em;
            font-weight: 500;
            border-radius: 0.6rem;
            margin-right: ${spacing(2)};
            box-shadow: ${shadow.sm};
            outline: none;
          }
          button :global(.icon) {
            margin-right: ${spacing(2)};
          }
          button:disabled {
            background-color: ${colors.gray[200]} !important;
            color: ${colors.gray[500]} !important;
            cursor: not-allowed;
          }

          button.small {
            font-size: 0.9rem;
          }
          button.small :global(.icon) {
            margin-right: ${spacing(1)};
          }
          button.medium {
            padding: ${spacing(1)} ${spacing(3)};
            font-size: 1.2rem;
            box-shadow: ${shadow.md};
          }
          button.large {
            padding: ${spacing(2)} ${spacing(4)};
            font-size: 1.4rem;
            box-shadow: ${shadow.md};
          }
        `}</style>
        <style jsx>{`
          button {
            color: ${invert ? colors[color][600] : "white"};
            background-color: ${invert
              ? colors[color][100]
              : colors[color][600]};
          }
          button:hover {
            color: ${invert ? colors[color][700] : "white"};
            background-color: ${invert
              ? colors[color][200]
              : colors[color][500]};
          }
        `}</style>
      </button>
    )
  }
)
