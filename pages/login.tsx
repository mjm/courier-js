import React from "react"

import { NextPage } from "next"

import { useAuth0 } from "components/Auth0Provider"
import Head from "components/Head"
import Loading from "components/Loading"
import withPublicPage from "hocs/withPublicPage"

const Login: NextPage = () => {
  const { authorize } = useAuth0()

  React.useEffect(() => {
    authorize()
  }, [])

  return (
    <main>
      <Head title="Logging In" />
      <Loading />
    </main>
  )
}

export default withPublicPage(Login)
