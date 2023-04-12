const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const fs = require('fs');
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
        title: "rook",
        inject: "body",
        // filename: 'index.html', //relative to root of the application
        inlineSource: '.(js|css)$' // embed all javascript and css inline        
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new FileManagerPlugin({
      events: {
        onEnd: {
          /*move: [
            { source: './dist/*.js', destination: 'web/' },
            { source: './dist/*.css', destination: 'web/' },
          ],*/
          delete: ['./dist/*.js', './dist/*.css']
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
    extensions: [".js", "*.css"],
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
