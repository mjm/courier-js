import React from "react"

import { IdToken } from "utils/auth0"

interface AuthState {
  user?: IdToken
  isAuthenticated: boolean
  isAuthenticating: boolean
}

const AuthContext = React.createContext<AuthState>({
  isAuthenticated: false,
  isAuthenticating: false,
})

export const AuthProvider: React.FC<{
  user: IdToken | undefined
  isAuthenticated: boolean
  isAuthenticating: boolean
}> = ({ children, ...rest }) => (
  <AuthContext.Provider value={rest}>{children}</AuthContext.Provider>
)

export const useAuth = (): AuthState => React.useContext(AuthContext)
