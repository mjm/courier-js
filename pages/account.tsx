import React from "react"
import styled from "styled-components"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import Container from "../components/container"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import Box from "../components/box"
import { InfoField } from "../components/info"
import { CurrentUserComponent } from "../lib/generated/graphql-components"
import Loading from "../components/loading"
import { ErrorBox } from "../components/error"
import { spacing } from "../utils/theme"

const AccountPageHeader = styled(PageHeader)`
  margin-bottom: ${spacing(6)};
`

const Account = () => {
  return (
    <div>
      <Container>
        <Head title="Your Account" />

        <AccountPageHeader>Your Account</AccountPageHeader>
        <CurrentUserComponent>
          {({ data, error, loading }) => {
            if (loading) {
              return <Loading />
            }

            if (error) {
              return <ErrorBox error={error} />
            }

            if (!data || !data.currentUser) {
              return null
            }
            const user = data.currentUser
            return (
              <Box>
                <InfoField label="Name">{user.name}</InfoField>
                <InfoField label="Twitter Username">{user.nickname}</InfoField>
              </Box>
            )
          }}
        </CurrentUserComponent>
      </Container>
    </div>
  )
}

export default withSecurePage(withData(Account))
