import React from "react"
import { colors, spacing, shadow } from "../utils/theme"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { isApolloError } from "apollo-client"

interface ErrorBoxProps {
  className?: string
  children?: React.ReactNode
  error?: Error
  errors?: Error[]
}
export const ErrorBox = ({
  className,
  children,
  error,
  errors,
}: ErrorBoxProps) => {
  errors = errors || []

  if (error) {
    if (isApolloError(error)) {
      errors = [...(errors || []), ...error.graphQLErrors]
    } else {
      errors = [...(errors || []), error]
    }
  }

  if (!errors.length && !children) {
    return null
  }

  return (
    <div className={`root ${className}`} role="alert">
      <FontAwesomeIcon icon={faExclamationCircle} className="icon" />
      {children && <div>{children}</div>}
      {errors &&
        (errors.length > 1 ? (
          <div>
            <p>There were some issues adding the feed:</p>
            <ul>
              {errors.map((err: Error, i: number) => (
                <li key={i}>{err.message}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div>{errors[0].message}</div>
        ))}
      <style jsx>{`
        .root {
          background-color: ${colors.red[100]};
          border-top: 4px solid ${colors.red[500]};
          color: ${colors.red[900]};
          padding: ${spacing(3)};
          display: flex;
          box-shadow: ${shadow.md};
          margin-bottom: ${spacing(4)};
          width: 100%;
        }
        div :global(.icon) {
          margin-right: ${spacing(2)};
          margin-top: 2px;
          color: ${colors.red[500]};
        }
        p {
          margin-top: 0;
          margin-bottom: 0.8em;
        }
        ul {
          padding-left: ${spacing(6)};
          margin-top: 0;
          margin-bottom: 0.5em;
        }
      `}</style>
    </div>
  )
}
