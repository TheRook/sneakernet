const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require('fs');
var HtmlWebpackInlineSourcePlugin = require('@effortlessmotion/html-webpack-inline-source-plugin');

isProduction = true;

module.exports = {
  mode: "production",
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: "self.location"
    // filename: 'index_bundle.js'
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
        title: "zip",
        //hash: true,
        inject: "body",
        // filename: './dist/index.html', //relative to root of the application
        inlineSource: '.(js|css)$' // embed all javascript and css inline        
    }),
    new HtmlWebpackInlineSourcePlugin()
    //new WebpackPandocPlugin()
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
  }  
}
