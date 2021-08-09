const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  entry: "./lib/index.js",
  target: "node",
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: "generate-next-links",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
      },
    ],
  },
};
