import { run, RequestHandler } from "micro"

export * from "micro"

export default function(fn: RequestHandler): RequestHandler {
  return (req, res) => {
    return run(req, res, fn)
  }
}
