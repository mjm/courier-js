import React from "react"
import withPublicPage from "../hocs/publicPage"
import { NextPage } from "next"
import Head from "../components/head"
import Loading from "../components/loading"
import { authorize } from "../utils/auth0"
import Container from "../components/container"

const Login: NextPage<{}> = () => {
  React.useEffect(() => {
    authorize()
  }, [])

  return (
    <Container>
      <Head title="Logging In" />
      <Loading />
    </Container>
  )
}

export default withPublicPage(Login)
