var webpack = require('webpack')

module.exports = {

  entry: {
    main: ['./src/cron.js']
  },
  output: {
    path: 'dist',
    publicPath: 'dist',
    filename: 'cron.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
    ]
  }

}
