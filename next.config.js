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
      STRIPE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    },

    webpack(config, options) {
      config.node = {
        fs: "empty",
      }

      config.plugins.push(new webpack.IgnorePlugin(/^pg-native$/))

      // https://github.com/felixge/node-formidable/issues/337
      config.plugins.push(new webpack.DefinePlugin({ "global.GENTLY": false }))

      config.module.rules.push({
        test: /\.graphql$/,
        exclude: /node_modules/,
        use: "raw-loader",
      })

      return config
    },
  })
)
