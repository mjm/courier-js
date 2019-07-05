import React from "react"
import withSecurePage from "../hocs/securePage"
import withData from "../hocs/apollo"
import Container from "../components/container"
import Head from "../components/head"
import { PageHeader } from "../components/header"
import { InfoField } from "../components/info"
import { CurrentUserComponent } from "../lib/generated/graphql-components"
import Loading from "../components/loading"
import { ErrorBox } from "../components/error"
import Card from "../components/card"
import Group from "../components/group"
import { Button } from "../components/button"
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons"
import { logout } from "../utils/auth0"

const Account = () => {
  return (
    <div>
      <Container>
        <Head title="Your Account" />

        <PageHeader mb={4}>Your Account</PageHeader>
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
              <Group direction="column" spacing={3}>
                <Card>
                  <InfoField label="Name">{user.name}</InfoField>
                  <InfoField label="Twitter Username">
                    <a
                      href={`https://twitter.com/${user.nickname}`}
                      target="_blank"
                    >
                      @{user.nickname}
                    </a>
                  </InfoField>
                </Card>
                <Button
                  color="red"
                  size="medium"
                  icon={faSignOutAlt}
                  onClick={() => logout()}
                >
                  Sign Out
                </Button>
              </Group>
            )
          }}
        </CurrentUserComponent>
      </Container>
    </div>
  )
}

export default withSecurePage(withData(Account))
