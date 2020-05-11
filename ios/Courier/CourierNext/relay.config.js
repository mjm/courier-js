module.exports = {
  src: ".",
  schema: "../../../schema.graphql",
  language: "swift",
  artifactDirectory: "./__generated__",
  customScalars: {
    Time: "String",
    Cursor: "String",
  },
};
