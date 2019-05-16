import Deserializer from "xmlrpc/lib/deserializer"
import Serializer from "xmlrpc/lib/serializer"
import { RequestHandler, send } from "./micro"

export interface XMLRPCRequest {
  methodName: string
  params: any[]
}

export type XMLRPCResponse = any

export interface XMLRPCRequestHandler {
  (req: XMLRPCRequest): Promise<XMLRPCResponse>
}

export function xmlrpc(fn: XMLRPCRequestHandler): RequestHandler {
  return async (req, res) => {
    const deserializer = new Deserializer()

    let xml
    try {
      const xreq = await new Promise<XMLRPCRequest>((resolve, reject) => {
        deserializer.deserializeMethodCall(
          req,
          (err: Error, methodName: string, params: any[]) => {
            if (err) {
              reject(err)
            } else {
              resolve({
                methodName,
                params,
              })
            }
          }
        )
      })
      const xres = await fn(xreq)
      xml = Serializer.serializeMethodResponse(xres)
    } catch (err) {
      xml = Serializer.serializeFault(err)
    }

    res.setHeader("Content-Type", "text/xml")
    send(res, 200, xml)
  }
}
