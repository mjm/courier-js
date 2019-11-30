import React from "react"
import withPublicPage from "../hocs/withPublicPage"
import { NextPage } from "next"
import Head from "../components/Head"
import Loading from "../components/Loading"
import { authorize } from "../utils/auth0"
import Container from "../components/Container"

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
