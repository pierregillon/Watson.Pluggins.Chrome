const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ChromeExtensionReloader  = require('webpack-chrome-extension-reloader');

module.exports = {
  entry: {
      contentScript: './src/browser/js/init.js',
      popup: "./src/popup/popup.js",
      background: "./src/background.js"
  },
  module: {
    rules: [{
        test: /\.js/,
        exclude: /(node_modules|bower_components)/,
        use: [{
            loader: 'babel-loader'
        }]
    }]
  },
  plugins: [
    new ChromeExtensionReloader({
      entries: {
        contentScript: ['contentScript', "popup"],
        background: 'background'
      }
    }),
    new CleanWebpackPlugin(['dist']),
    new CopyPlugin([
      { from: './src/manifest.json', to: './' },
      { from: './src/popup/popup.html', to: './' },
      { from: './src/popup/popup.css', to: './' },
      { from: './src/browser/css/global.css', to: './' },
      { from: './src/images', to: './images' },
    ]),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};