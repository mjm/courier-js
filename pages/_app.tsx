import React from "react"
import Router from "next/router"
import { AppProps } from "next/app"
import { renewSession, isAuthenticated } from "utils/auth0"
import { config } from "@fortawesome/fontawesome-svg-core"
import NProgress from "nprogress"
import MDXContainer from "components/MDXContainer"

config.autoAddCss = false

import "components/Tailwind.css"
import "components/Progress.css"
import "@fortawesome/fontawesome-svg-core/styles.css"

Router.events.on("routeChangeStart", (url: string) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

const App: React.FC<AppProps> = ({ Component, pageProps, router }) => {
  const [isAuthenticating, setAuthenticating] = React.useState(true)

  async function handleAuthenticating() {
    try {
      const authed = isAuthenticated()
      await renewSession()

      // if auth status changes, re-route to same URL to force initial props to be called again
      if (authed !== isAuthenticated()) {
        router.replace(router.asPath!)
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

  return (
    <MDXContainer>
      <Component {...pageProps} isAuthenticating={isAuthenticating} />
    </MDXContainer>
  )
}

export default App
