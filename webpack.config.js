const webpack = require('webpack')

const ArcGISPlugin = require("@arcgis/webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
            loader: "html-loader"
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
    new CopyWebpackPlugin([
      { 
        from: 'web/js/data',
        to: "js/data" },
        {
          from: "web/js/images",
          to: "js/images"
        }
  ]),
  new webpack.NormalModuleReplacementPlugin(/^dojo\/text!/, function(data) {
    data.request = data.request.replace(/^dojo\/text!/, "!!raw-loader!");
  }),
    new ArcGISPlugin(),

    new HtmlWebPackPlugin({
        title: "Build Project",
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