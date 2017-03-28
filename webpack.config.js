var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry: "./main",
    output: { filename: "app.js"},
    module: {
        loaders: [
            {
                test: /.ts$/,
                loader: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    plugins: [
        new OpenBrowserPlugin({ url: 'http://localhost:8080'})
    ]
}