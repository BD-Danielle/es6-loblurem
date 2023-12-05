const path = require('path'); // nodeJS core module for dealing with Path

module.exports = {
  mode: "production", // or development
  entry: "./js/es6.main.loblurem.js", // use Relative Path
  output: {
    path: path.resolve(__dirname, "./js/webpack"), // must use Path
    filename: "es6.main.loblurem.bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/i, // only check css files
        use: ["style-loader", "css-loader"] // right -> left, bottom -> top
      }
    ]
  },
  plugins: [],
}