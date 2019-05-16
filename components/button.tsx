import React from "react"
import { colors, spacing } from "../utils/theme"

type Props = React.PropsWithoutRef<JSX.IntrinsicElements["button"]>
export const PillButton = ({ children, ...props }: Props) => {
  return (
    <button type="button" {...props}>
      {children}
      <style jsx>{`
        button {
          background-color: ${colors.primary[600]};
          color: white;
          border: 0;
          padding: ${spacing(1)} ${spacing(3)};
          line-height: 1.5em;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 0.6rem;
          margin-right: ${spacing(2)};
        }

        button:hover {
          background-color: ${colors.primary[500]};
        }

        button > :global(svg) {
          margin-right: ${spacing(1)};
        }
      `}</style>
    </button>
  )
}
