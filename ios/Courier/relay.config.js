module.exports = {
  src: ".",
  schema: "../../schema.graphql",
  language: "swift",
  artifactDirectory: "./CourierCommon/Sources/CourierGenerated",
  customScalars: {
    Time: "String",
    Cursor: "String",
  },
};
