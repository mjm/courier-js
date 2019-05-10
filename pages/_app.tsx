import React from "react"
import App, { Container } from "next/app"
import Router from "next/router"
import { renewSession, isAuthenticated } from "../utils/auth0"
import "normalizecss/normalize.css"

class MyApp extends App {
  state = {
    isAuthenticating: true,
  }

  async componentDidMount() {
    if (Router.pathname === "/logged-in") {
      this.setState({ isAuthenticating: false })
      return
    }

    try {
      const authed = isAuthenticated()
      await renewSession()

      // if auth status changes, re-route to same URL to force initial props to be called again
      if (authed !== isAuthenticated()) {
        Router.replace(Router.asPath!)
      }
    } catch (err) {
      if (err.error !== "login_required") {
        console.error(err.error)
      }
    }

    this.setState({ isAuthenticating: false })
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Component
          {...pageProps}
          isAuthenticating={this.state.isAuthenticating}
        />
      </Container>
    )
  }
}

export default MyApp
