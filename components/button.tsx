import React from "react"
import { colors, spacing, shadow } from "../utils/theme"

type Props = React.PropsWithoutRef<JSX.IntrinsicElements["button"]> & {
  color?: "primary" | "red" | "blue"
  invert?: boolean
}
export const PillButton = ({
  children,
  color = "primary",
  invert = false,
  ...props
}: Props) => {
  return (
    <button type="button" {...props}>
      {children}
      <style jsx>{`
        button {
          border: 0;
          padding: ${spacing(1)} ${spacing(3)};
          line-height: 1.5em;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 0.6rem;
          margin-right: ${spacing(2)};
          box-shadow: ${shadow.sm};
        }
        button > :global(svg) {
          margin-right: ${spacing(1)};
        }
        button:disabled {
          background-color: ${colors.gray[200]} !important;
          color: ${colors.gray[500]} !important;
        }
      `}</style>
      <style jsx>{`
        button {
          color: ${invert ? colors[color][600] : "white"};
          background-color: ${invert ? colors[color][100] : colors[color][600]};
        }
        button:hover {
          color: ${invert ? colors[color][700] : "white"};
          background-color: ${invert ? colors[color][200] : colors[color][500]};
        }
      `}</style>
    </button>
  )
}
