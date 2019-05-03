import { useEffect } from "react"
import { parseHash, setToken } from "../utils/auth0"
import Router from "next/router"

const LoggedIn = () => {
  useEffect(() => {
    parseHash((err, result) => {
      if (err) {
        console.error("Something went wrong with logging in")
        return
      }

      if (result && result.idToken && result.accessToken) {
        setToken(result.idToken, result.accessToken)
        Router.push("/")
      }
    })
  }, [])

  return null
}

export default LoggedIn
