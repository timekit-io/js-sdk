'use strict';

module.exports = {
    entry: "./src/timekit.js",
    devtool: "source-map",
    output: {
        path: "./dist",
        filename: "timekit.js",
        libraryTarget: "umd",
        library: "timekit"
    },
    externals: [
      'axios',
      'base64'
    ]
};
