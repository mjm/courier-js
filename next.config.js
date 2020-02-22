const path = require("path")

const webpack = require("webpack")
const withMDX = require("@next/mdx")()
const withImages = require("next-images")

module.exports = withImages(
  withMDX({
    target: "serverless",

    pageExtensions: ["ts", "tsx", "mdx"],

    env: {
      GRAPHQL_URL: process.env.GRAPHQL_URL,
      INDIEAUTH_CALLBACK_URL: process.env.INDIEAUTH_CALLBACK_URL,
      PUSHER_AUTH_URL: process.env.PUSHER_AUTH_URL,
      CLIENT_ID: process.env.CLIENT_ID,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      API_IDENTIFIER: process.env.API_IDENTIFIER,
      STRIPE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
      PUSHER_KEY: process.env.PUSHER_KEY,
      PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
    },

    webpack(config, _options) {
      config.resolve.modules.push(__dirname)
      config.resolve.alias = {
        ...config.resolve.alias,
        "@mutations": path.join(__dirname, "components/mutations"),
        "@pages": path.join(__dirname, "components/pages"),
        "@events": path.join(__dirname, "components/events"),
        "@repositories": path.join(__dirname, "lib/repositories"),
        "@services": path.join(__dirname, "lib/services"),
      }

      config.node = {
        fs: "empty",
      }

      config.plugins.push(new webpack.IgnorePlugin(/^pg-native$/))

      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /courier-push\.p12$/,
          resource => {
            resource.request = resource.request.replace(
              /courier-push\.p12$/,
              process.env.APNS_CERTIFICATE
            )
          }
        )
      )

      config.module.rules.push({
        test: /\.graphql$/,
        exclude: /node_modules/,
        use: "raw-loader",
      })
      config.module.rules.push({
        test: /\.js.flow$/,
        loader: "ignore-loader",
      })

      return config
    },
  })
)
