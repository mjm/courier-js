import React from "react"
import { useRouter } from "next/router"
import { ErrorContainer, useErrors } from "components/ErrorContainer"
import withPublicPage from "hocs/withPublicPage"
import { NextPage } from "next"
import Head from "components/Head"
import { ErrorBox } from "components/ErrorBox"
import Loading from "components/Loading"
import { useAuth0 } from "components/Auth0Provider"

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
  const router = useRouter()
  const { receiveToken } = useAuth0()

  async function handleLogin() {
    try {
      await receiveToken()
      router.push("/")
    } catch (err) {
      setError(err)
    }
  }

  React.useEffect(() => {
    handleLogin()
  }, [])

  return (
    <main className="container mx-auto py-8">
      <Head title="Logging In" />
      <ErrorBox />
      {errors.length ? null : <Loading />}
    </main>
  )
}
