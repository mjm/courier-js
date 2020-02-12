module.exports = {
  src: "./components",
  schema: "./schema.graphql",
  language: "typescript",
  artifactDirectory: "./lib/__generated__",
  customScalars: {
    Time: "any",
  },
}
