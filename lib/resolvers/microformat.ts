import { MicroformatPageResolvers } from "../generated/graphql"

export const MicroformatPage: MicroformatPageResolvers = {
  authorizationEndpoint(doc) {
    if (
      doc.rels.authorization_endpoint &&
      doc.rels.authorization_endpoint.length
    ) {
      return doc.rels.authorization_endpoint[0]
    }

    return null
  },

  tokenEndpoint(doc) {
    if (doc.rels.token_endpoint && doc.rels.token_endpoint.length) {
      return doc.rels.token_endpoint[0]
    }

    return null
  },
}
