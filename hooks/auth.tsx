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

interface AuthProviderProps {
  children: React.ReactNode
  user: any | undefined
  isAuthenticated: boolean
  isAuthenticating: boolean
}
export const AuthProvider = ({ children, ...rest }: AuthProviderProps) => (
  <AuthContext.Provider value={rest}>{children}</AuthContext.Provider>
)

export const useAuth = () => React.useContext(AuthContext)
