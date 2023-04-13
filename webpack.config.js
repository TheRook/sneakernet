const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('@effortlessmotion/html-webpack-inline-source-plugin');

isProduction = true;

module.exports = {
  mode: "production",
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: ""
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
        title: "The Rookery",
        inject: "body",
        // filename: 'index.html', //relative to root of the application
        inlineSource: '.(js|css)$' // embed all javascript and css inline
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new FileManagerPlugin({
      events: {
        onEnd: {
          delete: ['./public/main.js','./public/main.css', './public/service-worker.js' ],
          move: [
            { source: './dist/main.js', destination: './public/main.js' },
            { source: './dist/main.css', destination: './public/main.css' },
            { source: './src/service-worker.js', destination: './public/service-worker.js' },
          ],
        }
      }
    }),
  ],
  module: {
    // exclude node_modules
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(css)$/,
        exclude: /node_modules/,
        use: [isProduction ? MiniCssExtractPlugin.loader : "style-loader","css-loader"]
      },      
    ],
  },
  // pass all js files through Babel
  resolve: {
    extensions: [".js", ".css"],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new HtmlMinimizerPlugin({
        test: /\.(html)$/,
      }),
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      })  
    ],
  },  
}
