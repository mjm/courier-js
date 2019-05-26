import React from "react"
import { spacing, colors, shadow, font } from "../utils/theme"

type BoxProps = React.PropsWithoutRef<JSX.IntrinsicElements["section"]> & {
  appearance?: "normal" | "canceled"
}
const Box = ({ children, appearance = "normal", ...props }: BoxProps) => {
  return (
    <section className={appearance} {...props}>
      {children}
      <style jsx>{`
        section {
          padding: ${spacing(4)};
          background-color: white;
          border-top: 3px solid ${colors.primary[500]};
          margin-bottom: ${spacing(4)};
          box-shadow: ${shadow.md};
          border-bottom-left-radius: 0.25rem;
          border-bottom-right-radius: 0.25rem;
          line-height: 1.5em;
        }
        section.canceled {
          color: ${colors.gray[700]};
          background-color: ${colors.gray[200]};
          border-top-color: ${colors.gray[400]};
        }
        * :global(a) {
          color: ${colors.primary[700]};
        }
      `}</style>
    </section>
  )
}

type BoxHeaderProps = React.PropsWithoutRef<JSX.IntrinsicElements["h3"]>
export const BoxHeader = ({ children, ...props }: BoxHeaderProps) => {
  return (
    <h3 {...props}>
      {children}
      <style jsx>{`
        h3 {
          font-family: ${font.display};
          font-size: 1.2rem;
          font-weight: 500;
          margin: 0;
          margin-bottom: ${spacing(2)};
          color: ${colors.primary[800]};
        }
        h3 :global(a) {
          color: ${colors.primary[800]};
          text-decoration: none;
        }
      `}</style>
    </h3>
  )
}

type BoxButtonsProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>
export const BoxButtons = ({ children, ...props }: BoxButtonsProps) => {
  return (
    <div {...props}>
      {children}
      <style jsx>{`
        div {
          margin-top: ${spacing(1)};
        }
        div > :global(*) {
          margin-top: ${spacing(3)};
        }
      `}</style>
    </div>
  )
}

export default Box
