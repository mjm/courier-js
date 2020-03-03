import { NextApiRequest, NextApiResponse } from "next"

import httpProxy from "http-proxy"

const proxy = httpProxy.createProxyServer({
  target: process.env.PING_URL,
  ignorePath: true,
})

export default (req: NextApiRequest, res: NextApiResponse) => {
  proxy.web(req, res)
}
