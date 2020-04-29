import { createFragmentContainer, graphql } from "react-relay"

import { UserInfoCard_user } from "@generated/UserInfoCard_user.graphql"

const UserInfoCard: React.FC<{
  user: UserInfoCard_user
}> = ({ user }) => {
  return (
    <div className="rounded-lg shadow-md bg-white p-4 flex flex-col items-center mb-4">
      <img src={user.picture} className="w-12 rounded-full mb-3" />
      <h1 className="font-bold text-primary-10">{user.name}</h1>
      <h2 className="text-neutral-5 text-sm">@{user.nickname}</h2>
    </div>
  )
}

export default createFragmentContainer(UserInfoCard, {
  user: graphql`
    fragment UserInfoCard_user on Viewer {
      name
      nickname
      picture
    }
  `,
})
