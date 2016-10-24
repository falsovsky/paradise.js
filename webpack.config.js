const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackOptions = {
    template: 'assets/index.hbs'
};

module.exports = {
    entry: "./app/index.js",
    output: {
        path: 'build',
        filename: "bundle.js",
        sourceMapFilename: 'bundle.js.map'
    },
    module: {
        loaders: [
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel',
              query: {
                presets: ['es2015']
              }
            },
            { test: /\.css$/, loader: "style!css" },
            { test: /\.json$/, loader: "json" },
            { test: /\.hbs$/, loader: "handlebars-loader" },
            { test: /\.(woff|png|jpg|gif)$/, loader: 'url-loader?limit=10000' },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] }
        ]
    },
    devtool: 'sourcemap',
    plugins: [
        new HtmlWebpackPlugin(htmlWebpackOptions),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          output: {
            comments: false,
            semicolons: true
          },
          sourceMap: true
        })
    ]
};
