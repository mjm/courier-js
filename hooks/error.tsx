import React from "react"
import { isApolloError } from "apollo-client"

interface ErrorState {
  errors: Error[]
  dispatch: React.Dispatch<Action>
}

const ErrorContext = React.createContext<ErrorState>({
  errors: [],
  dispatch: () => {},
})

type Action =
  | { type: "setErrors"; errors: Error[] }
  | { type: "setError"; error: Error }

const reducer: React.Reducer<{ errors: Error[] }, Action> = (
  _state,
  action
) => {
  switch (action.type) {
    case "setErrors":
      return { errors: action.errors }
    case "setError":
      if (isApolloError(action.error)) {
        return { errors: [...action.error.graphQLErrors] }
      } else {
        return { errors: [action.error] }
      }
  }
}

interface ErrorContainerProps {
  children: React.ReactNode
}
export const ErrorContainer = ({ children }: ErrorContainerProps) => {
  const [{ errors }, dispatch] = React.useReducer(reducer, { errors: [] })

  return (
    <ErrorContext.Provider value={{ errors, dispatch }}>
      {children}
    </ErrorContext.Provider>
  )
}

export const useErrors = () => {
  const { errors, dispatch } = React.useContext(ErrorContext)
  return {
    errors,
    setErrors(errors: Error[]) {
      dispatch({ type: "setErrors", errors })
    },
    setError(error: Error) {
      dispatch({ type: "setError", error })
    },
  }
}
