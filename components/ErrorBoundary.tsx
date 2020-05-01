import React from "react"

import { ErrorBox } from "components/ErrorBox"
import Router from "next/router"

interface State {
  error?: Error
}

class ErrorBoundary extends React.Component<{}, State> {
  state: State = {}

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    if (error.name === "RelayNetwork") {
      const inner = (error as any).source.errors[0]
      if (
        inner &&
        inner.extensions &&
        inner.extensions.code === "PermissionDenied"
      ) {
        Router.push("/login")
      }
    }
  }

  render() {
    if (this.state.error) {
      return (
        <main className="container mx-auto mt-8">
          <ErrorBox
            title="Oh no! Something went wrong."
            error={this.state.error}
          />
        </main>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
