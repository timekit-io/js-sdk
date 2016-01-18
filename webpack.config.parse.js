'use strict';

var webpack = require("webpack");

module.exports = {
    entry: "./src/timekit.js",
    devtool: "source-map",
    target: "node",
    output: {
        path: "./dist",
        filename: "timekit-sdk.parse.js",
        libraryTarget: "commonjs2",
        library: "timekit"
    },
    plugins: [
        new webpack.IgnorePlugin(/vertx/)
    ],
    module: {
        loaders: [
            { test: /\.json$/, loader: "json" },
        ]
    }
};
