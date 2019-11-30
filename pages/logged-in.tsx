import React from "react"
import { parseHash, setToken } from "../utils/auth0"
import Router from "next/router"
import { ErrorContainer, useErrors } from "../hooks/error"
import withPublicPage from "../hocs/publicPage"
import { NextPage } from "next"
import Container from "../components/Container"
import Head from "../components/head"
import { ErrorBox } from "../components/error"
import Loading from "../components/loading"

const LoggedIn: NextPage<{}> = () => {
  return (
    <ErrorContainer>
      <ProcessLogin />
    </ErrorContainer>
  )
}

export default withPublicPage(LoggedIn)

const ProcessLogin = () => {
  const { errors, setError } = useErrors()

  React.useEffect(() => {
    parseHash((err, result) => {
      if (err) {
        setError(
          new Error(`Could not log in to Courier: ${err.errorDescription}`)
        )
        return
      }

      if (result) {
        setToken(result)
        Router.push("/")
      }
    })
  }, [])

  return (
    <Container pt={4}>
      <Head title="Logging In" />
      <ErrorBox />
      {errors.length ? null : <Loading />}
    </Container>
  )
}
