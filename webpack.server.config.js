const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const distDir = path.join(__dirname, 'dist');
const sourceDir = path.join(__dirname, 'src');

module.exports = {
  entry: {  server: './src/server/main.ts' },
  resolve: { extensions: ['.js', '.ts'] },
  target: 'node',
  // this makes sure we include node_modules and other 3rd party libraries
  externals: [/(node_modules|main\..*\.js)/, nodeExternals()],
  // externals: [/(node_modules|main\..*\.js)/],
  output: {
    path: distDir,
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    // Temporary Fix for issue: https://github.com/angular/angular/issues/11580
    // for "WARNING Critical dependency: the request of a dependency is an expression"
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      sourceDir, // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      sourceDir,
      {}
    ),
    new CopyWebpackPlugin([
      {from: path.join(sourceDir, 'server/assets'), to: path.join(distDir, 'server/assets')}
    ]/*, options*/)
  ]
};
