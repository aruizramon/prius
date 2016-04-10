var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './src'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      }
    ],
  }
};
