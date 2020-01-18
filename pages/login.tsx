import React from "react"
import withPublicPage from "hocs/withPublicPage"
import { NextPage } from "next"
import Head from "components/Head"
import Loading from "components/Loading"
import { authorize } from "utils/auth0"

const Login: NextPage<{}> = () => {
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
