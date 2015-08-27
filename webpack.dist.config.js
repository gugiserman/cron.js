var webpack = require('webpack')

module.exports = {

  entry: {
    main: ['./src/cron.js']
  },
  output: {
    path: 'dist',
    publicPath: 'dist',
    filename: 'cron.min.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]

}
