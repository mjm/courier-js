const webpack = require("webpack")
const withMDX = require("@next/mdx")()
const withImages = require("next-images")

module.exports = withImages(
  withMDX({
    target: "serverless",

    pageExtensions: ["ts", "tsx", "mdx"],

    experimental: {
      reactMode: "concurrent",
    },

    webpack(config, _options) {
      config.node = {
        fs: "empty",
      }

      config.plugins.push(new webpack.IgnorePlugin(/^pg-native$/))

      config.module.rules.push({
        test: /\.js.flow$/,
        loader: "ignore-loader",
      })

      return config
    },
  })
)
