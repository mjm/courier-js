import React from "react"

import { useErrors } from "components/ErrorContainer"
import Notice from "components/Notice"

export const ErrorBox: React.FC<{
  title?: string
  className?: string
  error?: Error
  errors?: Error[]
}> = ({ title, className, error, errors }) => {
  // pull errors from the ErrorContainer if none are passed in
  const { errors: ctxErrors, clearErrors } = useErrors()
  let onClose: undefined | (() => void)

  if (ctxErrors && !errors && !error) {
    errors = ctxErrors
    onClose = clearErrors
  } else {
    errors = errors || []

    if (error) {
      errors = [...errors, ...unwrapRelayError(error)]
    }
  }

  if (!errors.length) {
    return null
  }

  return (
    <Notice
      title={title}
      variant="error"
      onClose={onClose}
      className={className}
    >
      {errors.length > 1 ? (
        <ul className="ml-2 pl-3">
          {errors.map((err: Error, i: number) => (
            <li key={i}>{err.message}</li>
          ))}
        </ul>
      ) : (
        errors[0].message
      )}
    </Notice>
  )
}

function unwrapRelayError(error: any): Error[] {
  if (error.name === "RelayNetwork") {
    return error.source.errors.map(({ message }: any) => new Error(message))
  }
  return [error]
}
