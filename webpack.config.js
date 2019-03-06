const ArcGISPlugin = require("@arcgis/webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const path = require("path");

module.exports = {
  entry: {
    index: ["./web/buildProject.css", "./web/index.js"]
  },
  output: {
    filename: "[name].[chunkhash].js",
    publicPath: ""
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),

    new ArcGISPlugin(),

    new HtmlWebPackPlugin({
        title: "ArcGIS Template Application",
        template: "./web/index.html",
        filename: "./index.html",
        chunksSortMode: "none",
        inlineSource: ".(css)$"
      }),  

    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash].css",
      chunkFilename: "[id].css"
    })
  ],
  resolve: {
    modules: [
      path.resolve(__dirname, "/web"),
      path.resolve(__dirname, "node_modules/")
    ],
    extensions: [ ".js", ".css"]
  },
  node: {
    process: false,
    global: false,
    fs: "empty"
  }
};