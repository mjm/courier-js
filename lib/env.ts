import { injectable } from "inversify"

@injectable()
class Environment {
  authDomain: string
  apiIdentifier: string
  clientId: string
  backendClientId: string
  backendClientSecret: string
  twitterConsumerKey: string
  twitterConsumerSecret: string
  stripeKey: string
  monthlyPlanId: string
  authEncryptKey: Buffer
  apns: {
    certificate: string
    passphrase: string
  }

  constructor() {
    this.authDomain = requireEnv("AUTH_DOMAIN")
    this.apiIdentifier = requireEnv("API_IDENTIFIER")
    this.clientId = requireEnv("CLIENT_ID")
    this.backendClientId = requireEnv("BACKEND_CLIENT_ID")
    this.backendClientSecret = requireEnv("BACKEND_CLIENT_SECRET")
    this.twitterConsumerKey = requireEnv("TWITTER_CONSUMER_KEY")
    this.twitterConsumerSecret = requireEnv("TWITTER_CONSUMER_SECRET")
    this.stripeKey = requireEnv("STRIPE_SECRET_KEY")
    this.monthlyPlanId = requireEnv("MONTHLY_PLAN_ID")
    this.authEncryptKey = Buffer.from(requireEnv("AUTH_ENCRYPT_KEY"), "base64")
    this.apns = {
      certificate: requireEnv("APNS_CERTIFICATE"),
      passphrase: requireEnv("APNS_PASSPHRASE"),
    }
  }
}

export default Environment

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`No ${key} set in environment`)
  }

  return value
}
