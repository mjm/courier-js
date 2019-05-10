import React from "react"
import App, { Container } from "next/app"
import Router from "next/router"
import { renewSession, isAuthenticated } from "../utils/auth0"

class MyApp extends App {
  async componentDidMount() {
    if (Router.pathname === "/logged-in") {
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
      if (err.error === "login_required") {
        return
      }

      console.error(err.error)
    }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
