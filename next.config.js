const webpack = require("webpack")
const withCSS = require("@zeit/next-css")
const withFonts = require("next-fonts")

module.exports = withCSS(
  withFonts({
    target: "serverless",

    env: {
      CLIENT_ID: process.env.CLIENT_ID,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      API_IDENTIFIER: process.env.API_IDENTIFIER,
    },

    webpack(config, options) {
      config.node = {
        fs: "empty",
      }

      config.plugins.push(new webpack.IgnorePlugin(/^pg-native$/))

      return config
    },
  })
)
