import React from "react"

interface ErrorState {
  errors: Error[]
  dispatch: React.Dispatch<Action>
}

const ErrorContext = React.createContext<ErrorState>({
  errors: [],
  dispatch: () => {
    // do nothing
  },
})

type Action =
  | { type: "setErrors"; errors: Error[] }
  | { type: "setError"; error: Error }
  | { type: "clearErrors" }

const reducer: React.Reducer<{ errors: Error[] }, Action> = (
  _state,
  action
) => {
  switch (action.type) {
    case "setErrors":
      return { errors: action.errors }
    case "setError":
      return { errors: unwrapRelayError(action.error) }
    case "clearErrors":
      return { errors: [] }
  }
}

interface ErrorContainerProps {
  children: ((bag: ErrorsBag) => React.ReactNode) | React.ReactNode
}
export const ErrorContainer = ({
  children,
}: ErrorContainerProps): React.ReactElement => {
  const [{ errors }, dispatch] = React.useReducer(reducer, { errors: [] })
  const ctx = { errors, dispatch }

  if (children instanceof Function) {
    const bag = createErrorsBag(ctx)
    children = children(bag)
  }

  return <ErrorContext.Provider value={ctx}>{children}</ErrorContext.Provider>
}

export const useErrors = (): ErrorsBag =>
  createErrorsBag(React.useContext(ErrorContext))

interface ErrorsBag {
  errors: Error[]
  setErrors(errors: Error[]): void
  setError(error: Error): void
  clearErrors(): void
}

function createErrorsBag({ errors, dispatch }: ErrorState): ErrorsBag {
  return {
    errors,
    setErrors(errors: Error[]) {
      dispatch({ type: "setErrors", errors })
    },
    setError(error: Error) {
      dispatch({ type: "setError", error })
    },
    clearErrors() {
      dispatch({ type: "clearErrors" })
    },
  }
}

interface RelayError extends Error {
  name: "RelayNetwork"
  source: {
    errors: { message: string }[]
  }
}

export function unwrapRelayError(error: Error): Error[] {
  if (error.name === "RelayNetwork") {
    return (error as RelayError).source.errors.map(
      ({ message }) => new Error(message)
    )
  }
  return [error]
}
