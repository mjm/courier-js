import { NextApiRequest, NextApiResponse } from "next"

import httpProxy from "http-proxy"

const proxy = httpProxy.createProxyServer({
  target: process.env.PING_URL,
  ignorePath: true,
  changeOrigin: true,
})

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  return new Promise((resolve, reject) => {
    proxy.web(req, res, undefined, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export const config = {
  api: {
    bodyParser: false,
  },
}
