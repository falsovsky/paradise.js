const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackOptions = {
    template: 'assets/index.hbs'
};

module.exports = {
    entry: "./app/index.js",
    output: {
        path: 'build',
        filename: "bundle.js"
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
    plugins: [
        new HtmlWebpackPlugin(htmlWebpackOptions)
    ]
};
