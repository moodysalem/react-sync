var webpack = require('webpack');
var min = process && process.env && process.env.ENVIRONMENT === 'PRODUCTION';

module.exports = {
  entry: "./index.js",

  output: {
    path: "./dist",
    filename: "react-sync" + (min ? '.min' : '') + '.js',
    library: "ReactSync",
    libraryTarget: "umd"
  },

  externals: [
    // all non-relative requires
    /^[a-z\-0-9]+$/
  ],

  plugins: min ? [
    new webpack.optimize.UglifyJsPlugin()
  ] : []
};