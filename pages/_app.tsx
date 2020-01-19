import React from "react"
import { useRouter } from "next/router"
import { AppProps } from "next/app"
import { isAuthenticated } from "utils/auth0"
import { config } from "@fortawesome/fontawesome-svg-core"
import NProgress from "nprogress"
import MDXContainer from "components/MDXContainer"
import { Auth0Provider, useAuth0 } from "components/Auth0Provider"

config.autoAddCss = false

import "components/Tailwind.css"
import "components/Progress.css"
import "@fortawesome/fontawesome-svg-core/styles.css"

const App: React.FC<AppProps> = props => (
  <Auth0Provider>
    <AppInner {...props} />
  </Auth0Provider>
)

export default App

function useAuthenticating(): boolean {
  const router = useRouter()
  const { renewSession } = useAuth0()
  const [isAuthenticating, setAuthenticating] = React.useState(true)

  async function handleAuthenticating(): Promise<void> {
    try {
      const authed = isAuthenticated()
      await renewSession()

      // if auth status changes, re-route to same URL to force initial props to be called again
      if (authed !== isAuthenticated()) {
        router.replace(router.asPath)
      }
    } catch (err) {
      if (err.error !== "login_required") {
        console.error(err.error)
      }
    }

    setAuthenticating(false)
  }

  React.useEffect(() => {
    if (router.pathname === "/logged-in") {
      setAuthenticating(false)
      return
    }

    handleAuthenticating()
  }, [])

  return isAuthenticating
}

function useProgressBar(): void {
  const router = useRouter()

  React.useEffect(() => {
    const onStart = (url: string): void => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
    const onEnd = (): void => {
      NProgress.done()
    }

    router.events.on("routeChangeStart", onStart)
    router.events.on("routeChangeComplete", onEnd)
    router.events.on("routeChangeError", onEnd)

    return () => {
      router.events.off("routeChangeStart", onStart)
      router.events.off("routeChangeComplete", onEnd)
      router.events.off("routeChangeError", onEnd)
    }
  }, [])
}

const AppInner: React.FC<AppProps> = ({ Component, pageProps }) => {
  const isAuthenticating = useAuthenticating()
  useProgressBar()

  return (
    <MDXContainer>
      <Component {...pageProps} isAuthenticating={isAuthenticating} />
    </MDXContainer>
  )
}
