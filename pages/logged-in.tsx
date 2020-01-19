import React from "react"

import { NextPage } from "next"
import { useRouter } from "next/router"

import { useAuth0 } from "components/Auth0Provider"
import { ErrorBox } from "components/ErrorBox"
import { ErrorContainer, useErrors } from "components/ErrorContainer"
import Head from "components/Head"
import Loading from "components/Loading"
import withPublicPage from "hocs/withPublicPage"

const LoggedIn: NextPage<{}> = () => {
  return (
    <ErrorContainer>
      <ProcessLogin />
    </ErrorContainer>
  )
}

export default withPublicPage(LoggedIn)

const ProcessLogin: React.FC = () => {
  const { errors, setError } = useErrors()
  const router = useRouter()
  const { receiveToken } = useAuth0()

  async function handleLogin(): Promise<void> {
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
