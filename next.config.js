const withTypescript = require("@zeit/next-typescript")

module.exports = withTypescript({
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

    return config
  },
})
