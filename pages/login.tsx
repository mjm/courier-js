import { useEffect } from "react"

import { authorize } from "../utils/auth0"

const Login = () => {
  useEffect(() => {
    authorize()
  }, [])

  return null
}

export default Login
