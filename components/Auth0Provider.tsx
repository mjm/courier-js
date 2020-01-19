import React from "react"

import dynamic from "next/dynamic"

import Cookie from "js-cookie"
import jwtDecode from "jwt-decode"

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const Auth0Context = React.createContext<Auth0Helpers>(null!)

// Use a dynamic import to let us avoid loading auth0-js on the server side.
export const Auth0Provider = dynamic(
  async (): Promise<React.FC> => {
    if (process.browser) {
      const auth0 = await import("auth0-js")
      const client = new auth0.WebAuth({
        clientID: process.env.CLIENT_ID || "",
        domain: process.env.AUTH_DOMAIN || "",
        responseType: "token id_token",
        redirectUri: `${window.location.protocol}//${window.location.host}/logged-in`,
        scope:
          "openid profile email https://courier.blog/customer_id https://courier.blog/subscription_id",
        audience: process.env.API_IDENTIFIER,
      })
      return ({ children }) => (
        <Auth0Context.Provider value={new Auth0Helpers(client)}>
          {children}
        </Auth0Context.Provider>
      )
    } else {
      return ({ children }) => (
        <Auth0Context.Provider value={new Auth0Helpers()}>
          {children}
        </Auth0Context.Provider>
      )
    }
  }
)

export function useAuth0(): Auth0Helpers {
  return React.useContext(Auth0Context)
}

let tokenRenewalTimeout: number | undefined

class Auth0Helpers {
  constructor(private client?: auth0.WebAuth) {}

  authorize = (): void => {
    if (!this.client) {
      return
    }

    this.client.authorize()
  }

  receiveToken = async (): Promise<void> => {
    const client = this.client
    if (!client) {
      return
    }

    try {
      const token = await this._parseHash()
      if (token) {
        this._setToken(token)
      }
    } catch (err) {
      throw new Error(`Could not log in to Courier: ${err.errorDescription}`)
    }
  }

  renewSession = async (): Promise<void> => {
    const client = this.client
    if (!client) {
      return
    }

    return new Promise((resolve, reject) => {
      client.checkSession({}, (err, result) => {
        if (err) {
          reject(err)
        } else if (result) {
          this._setToken(result)
          resolve()
        }
      })
    })
  }

  logout = (): void => {
    if (!this.client) {
      return
    }

    Cookie.remove("user")
    Cookie.remove("idToken")
    Cookie.remove("accessToken")
    Cookie.remove("expiresAt")

    clearTimeout(tokenRenewalTimeout)
    this.client.logout({ returnTo: window.location.origin })
  }

  private async _parseHash(): Promise<auth0.Auth0DecodedHash | null> {
    const client = this.client
    if (!client) {
      return null
    }

    return new Promise((resolve, reject) => {
      client.parseHash((err, result) => {
        if (err) {
          reject(err)
          return
        }

        resolve(result)
      })
    })
  }

  private _setToken(result: auth0.Auth0DecodedHash): void {
    if (!this.client) {
      return
    }

    Cookie.set("user", jwtDecode(result.idToken as string))
    Cookie.set("idToken", result.idToken as string)
    Cookie.set("accessToken", result.accessToken as string)

    const expiresAt = (result.expiresIn as number) * 1000 + Date.now()
    Cookie.set("expiresAt", `${expiresAt}`)

    this._scheduleRenewal(expiresAt)
  }

  private _scheduleRenewal(expiresAt: number): void {
    const timeout = expiresAt - Date.now()
    if (timeout > 0) {
      tokenRenewalTimeout = (setTimeout(() => {
        this._attemptRenewToken()
      }, timeout) as unknown) as number
    }
  }

  private async _attemptRenewToken(): Promise<void> {
    try {
      await this.renewSession()
    } catch (err) {
      this.logout()
    }
  }
}
