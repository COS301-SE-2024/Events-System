const path = require("path");
const { codecovWebpackPlugin } = require("@codecov/webpack-plugin");

module.exports = {
    module: {
      rules: [
        {
          test: /\.scss$/,
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              ident: 'postcss',
              syntax: 'postcss-scss',
              plugins: [
                require('postcss-import'),
                require('tailwindcss'),
                require('autoprefixer'),
                codecovWebpackPlugin({
                  enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
                  bundleName: "example-webpack-bundle",
                  uploadToken: process.env.CODECOV_TOKEN,
                }),
              ],
            },
          },
        },
      ],
    },
  };