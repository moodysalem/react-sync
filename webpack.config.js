var webpack = require('webpack');

module.exports = {
  entry: "./src/index.jsx",

  output: {
    path: "./dist",
    filename: 'react-sync.js',
    library: "ReactSync",
    libraryTarget: "umd"
  },

  externals: {
    'react': { commonjs: 'react', commonjs2: 'react', amd: 'react', root: 'React' }
  },

  module: {
    loaders: [
      // interpret ES6
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  resolve: {
    extensions: [ '', '.js', '.jsx' ]
  }
};