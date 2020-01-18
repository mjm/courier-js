import { getToken, logout } from "utils/auth0"

const UserActionsCard: React.FC = () => {
  async function copyAPIToken() {
    const token = getToken(null, "accessToken")
    if (token) {
      await navigator.clipboard.writeText(token)
    }
  }

  return (
    <div className="rounded-lg shadow-md bg-neutral-1 p-4">
      <div className="flex flex-wrap -mx-4 -mb-4">
        <div className="w-1/2 md:w-full px-4 mb-4">
          <button
            onClick={copyAPIToken}
            className="w-full btn btn-second border-neutral-4 text-neutral-8 font-medium"
          >
            Copy API token
          </button>
        </div>
        <div className="w-1/2 md:w-full px-4 mb-4">
          <button
            onClick={() => logout()}
            className="w-full btn btn-second border-neutral-4 text-neutral-8 font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserActionsCard
