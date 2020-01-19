import React from "react"

interface AuthState {
  user?: any
  isAuthenticated: boolean
  isAuthenticating: boolean
}

const AuthContext = React.createContext<AuthState>({
  isAuthenticated: false,
  isAuthenticating: false,
})

export const AuthProvider: React.FC<{
  user: any | undefined
  isAuthenticated: boolean
  isAuthenticating: boolean
}> = ({ children, ...rest }) => (
  <AuthContext.Provider value={rest}>{children}</AuthContext.Provider>
)

export const useAuth = (): AuthState => React.useContext(AuthContext)
