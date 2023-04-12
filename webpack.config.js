const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const pandoc = require('node-pandoc');
const fs = require('fs');
//const InlineSourceWebpackPlugin = require('inline-source-webpack-plugin');
// var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

isProduction = true;

class WebpackPandocPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('WebpackPandocPlugin', () => {
      const distDir = './dist';
      const outputDir = "./dist" //this.options.outputDir || './combined';
      
      const combinedHTMLFileName = 'combined.html';
      const combinedHTMLFilePath = `${outputDir}/${combinedHTMLFileName}`;
      
      const inputFiles = fs.readdirSync(distDir).filter(file => {
        return file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif');
      }).map(file => `${distDir}/${file}`);
      
      pandoc("./dist/index.html", ['-f', 'html', '-t', 'html5', '-s', '-o', combinedHTMLFilePath], function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(`Combined HTML file created at ${combinedHTMLFilePath}`);
        }
      });
    });
  }
}

module.exports = {

  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    // filename: 'index_bundle.js'
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
        //hash: true,
        // inject: "body",
        // filename: './dist/index.html', //relative to root of the application
        inlineSource: '.(js|css)$' // embed all javascript and css inline        
    }),
    new WebpackPandocPlugin()
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
