const path = require("path");

module.exports = {
  // publicPath: process.env.NODE_ENV === "production" ? "/phase-10/" : "/",
  publicPath: "/",
  outputDir: path.resolve(__dirname, "../server/public"),
  devServer: {
    proxy: {
      "/": {
        target: "http://localhost:2105/",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
