var webpack = require("webpack")
var nodeExternals = require('webpack-node-externals')
var path = require('path')

module.exports = {
    entry: "./src/index.js",
    output: {
        path: __dirname,
        filename: "index.js"
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'stage-0']
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
          banner: '#!/usr/bin/env node',
          raw: true
        })
    ]
}
