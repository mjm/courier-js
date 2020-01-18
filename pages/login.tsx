import React from "react"
import withPublicPage from "hocs/withPublicPage"
import { NextPage } from "next"
import Head from "components/Head"
import Loading from "components/Loading"
import { useAuth0 } from "components/Auth0Provider"

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
