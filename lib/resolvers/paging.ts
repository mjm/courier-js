import { GraphQLScalarType, Kind } from "graphql"

export const Cursor = new GraphQLScalarType({
  name: "Cursor",
  description: "An opaque cursor type",
  parseValue(value) {
    const buffer = Buffer.from(value, "base64")
    return buffer.toString("utf8")
  },
  serialize(value) {
    const buffer = Buffer.from(`${value}`, "utf8")
    return buffer.toString("base64")
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(`A Cursor must be a string`)
    }

    const { value } = ast
    const buffer = Buffer.from(value, "base64")
    return buffer.toString("utf8")
  },
})
