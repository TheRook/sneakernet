const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const InlineSourceWebpackPlugin = require('inline-source-webpack-plugin');
// var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

isProduction = true;

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    // filename: 'index_bundle.js'
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
        hash: true,
        inject: "body",
        filename: './dist/index.html', //relative to root of the application
        inlineSource: '.(js|css)$' // embed all javascript and css inline        
    }),
    // new HtmlWebpackInlineSourcePlugin(),
    new InlineSourceWebpackPlugin({
      compress: true,
      rootpath: './src',
      noAssetMatch: 'warn'
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
    extensions: ["*", ".js", "*.css"],
  }  
}
