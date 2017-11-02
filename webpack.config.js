const path = require('path');

module.exports = {
  entry: './src/index.jsx',

  output: {
    path: path.resolve('./dist'),
    filename: 'react-sync.js',
    library: 'ReactSync',
    libraryTarget: 'umd'
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
        loader: 'babel-loader'
      }
    ]
  },

  resolve: {
    extensions: [ '.js', '.jsx' ]
  }
};