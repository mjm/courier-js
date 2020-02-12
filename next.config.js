const path = require("path")

const webpack = require("webpack")
const withMDX = require("@next/mdx")()

module.exports = withMDX({
  target: "serverless",

  pageExtensions: ["ts", "tsx", "mdx"],

  env: {
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    CLIENT_ID: process.env.CLIENT_ID,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    API_IDENTIFIER: process.env.API_IDENTIFIER,
    STRIPE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  },

  webpack(config, _options) {
    config.resolve.modules.push(__dirname)
    config.resolve.alias = {
      ...config.resolve.alias,
      "@mutations": path.join(__dirname, "components/mutations"),
      "@pages": path.join(__dirname, "components/pages"),
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

    return config
  },
})
