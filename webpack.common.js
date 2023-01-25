const path = require('path');

module.exports = {
  entry: './src/timekit.js',
  resolve: {
    extensions: ['.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'timekit-sdk.js',
    libraryTarget: 'umd',
    library: "timekit",
    clean: true,
  },
};