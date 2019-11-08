const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/** @type import('webpack').Configuration */
module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "src", "app04.ts"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.js"
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    },
    plugins: [new HtmlWebpackPlugin()],
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        port: 8080
    }
};
