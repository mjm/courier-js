import React from "react"
import { colors } from "../utils/theme"

type InfoFieldProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]> & {
  label: string
}
export const InfoField = ({
  className,
  label,
  children,
  ...props
}: InfoFieldProps) => {
  return (
    <div className={`field ${className}`} {...props}>
      <div className="label">{label}</div>
      <div className="value">{children}</div>
      <style jsx>{`
        .field {
          display: flex;
          line-height: 1.8em;
        }
        .label {
          width: 180px;
          color: ${colors.primary[800]};
          font-weight: 500;
        }
        .value {
          color: ${colors.gray[900]};
        }
      `}</style>
    </div>
  )
}
