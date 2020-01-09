export enum IdPrefix {
  Feed = "feed",
  FeedSubscription = "sub",
  Tweet = "twt",
  Event = "evt",
  DeviceToken = "dev",
  Post = "post",
}

export function toExternalId(prefix: IdPrefix, id: string): string {
  return `${prefix}_${Buffer.from(id).toString("base64")}`
}

export function fromExternalId(id: string): [IdPrefix, string]
export function fromExternalId(id: string, expectedPrefix: IdPrefix): string
export function fromExternalId(
  id: string,
  expectedPrefix?: IdPrefix
): string | [IdPrefix, string] {
  const [prefix, encodedId] = id.split("_", 2)
  const decodedId = Buffer.from(encodedId, "base64").toString()

  if (expectedPrefix) {
    if (prefix !== expectedPrefix) {
      throw new Error(
        `Expected ID with prefix '${expectedPrefix}', but got '${prefix}' instead`
      )
    }

    return decodedId
  }

  for (const p of Object.values(IdPrefix)) {
    if (p === prefix) {
      return [p, decodedId]
    }
  }

  throw new Error(`Unrecognized ID prefix '${prefix}'`)
}
