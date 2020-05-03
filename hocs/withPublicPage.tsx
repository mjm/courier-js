import { NextPage } from "next"

import Nav from "components/Nav"
import { AuthProvider } from "components/AuthProvider"

export default function withPublicPage<T>(Page: NextPage<T>): NextPage<T> {
  return props => {
    return (
      <AuthProvider
        user={undefined}
        isAuthenticated={false}
        isAuthenticating={false}
      >
        <Nav />
        <Page {...props} />
      </AuthProvider>
    )
  }
}
