import { getToken } from "../utils/auth0"
import Card from "./card"
import { InfoField } from "./info"
import Group from "./group"
import { Button } from "./button"
import { faCopy } from "@fortawesome/free-solid-svg-icons"
import { createFragmentContainer, graphql } from "react-relay"
import { UserInfoCard_user } from "../lib/__generated__/UserInfoCard_user.graphql"

interface Props {
  user: UserInfoCard_user
}

const UserInfoCard: React.FC<Props> = ({ user }) => {
  async function copyAPIToken() {
    const token = getToken(null, "accessToken")
    if (token) {
      await navigator.clipboard.writeText(token)
    }
  }

  return (
    <Card>
      <InfoField label="Name">{user.name}</InfoField>
      <InfoField label="Twitter Username">
        <a href={`https://twitter.com/${user.nickname}`} target="_blank">
          @{user.nickname}
        </a>
      </InfoField>

      <Group mt={3} direction="row" spacing={2} wrap alignItems="center">
        <Button icon={faCopy} onClick={copyAPIToken}>
          Copy API Token
        </Button>
      </Group>
    </Card>
  )
}

export default createFragmentContainer(UserInfoCard, {
  user: graphql`
    fragment UserInfoCard_user on User {
      name
      nickname
    }
  `,
})
