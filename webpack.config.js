const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
      contentScript: './src/browser/js/init.js',
      popup: "./src/extension/popup.js",
      background: "./src/background.js"
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CopyPlugin([
      { from: './src/manifest.json', to: './' },
      { from: './src/extension/popup.html', to: './' },
      { from: './src/extension/popup.css', to: './' },
      { from: './src/browser/css/global.css', to: './' },
      { from: './src/extension/images', to: './images' },
    ]),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};