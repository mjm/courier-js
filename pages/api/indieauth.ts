import { NextApiRequest, NextApiResponse } from "next"

import fetch from "isomorphic-unfetch"

import { getToken } from "utils/auth0"

// language=GraphQL
const query = `
  mutation CompleteIndieAuth(
    $input: CompleteIndieAuthInput!
  ) {
    completeIndieAuth(input: $input) {
      origin
    }
  }
`

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { code, state } = req.query
  const data = req.cookies.indieauth
  const token = getToken(req, "accessToken")

  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL || ""
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      operationName: "CompleteIndieAuth",
      query: query,
      variables: {
        input: {
          code,
          state,
          data,
        },
      },
    }),
  })

  if (response.status > 299) {
    throw new Error(`Unexpected response code from GraphQL: ${response.status}`)
  }

  const body = await response.json()
  const origin = body.data.completeIndieAuth.origin

  res.status(301)
  res.setHeader("Location", origin)
  res.end()
}
