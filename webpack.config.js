const path = require("path");

module.exports = {
  entry: "./index.js",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    clean: true,
    libraryTarget: "umd",
    libraryExport: "default",
    library: "Quiz"
  },
};
