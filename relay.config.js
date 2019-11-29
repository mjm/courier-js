module.exports = {
  src: ".",
  schema: "./schema.graphql",
  exclude: [
    "**/.next/**",
    "**/node_modules/**",
    "**/__generated__/**",
    "**/ios/**",
  ],
  language: "typescript",
  artifactDirectory: "./lib/__generated__",
  customScalars: {
    DateTime: "any",
  },
}
