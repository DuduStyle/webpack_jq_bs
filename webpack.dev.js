const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");
const baseConfig = require("./webpack.base");
// const baseConfig = require("./webpack.base.conf");

const devConfig = {
    mode: "development",
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin()
    ],
    devServer: {
        stats: "errors-only",
        inline: true,
        open: true, // 自动打开浏览器
        contentBase: path.join(__dirname, "./dist"),
        publicPath: "",
        compress: true,
        hot: true,
        host: "localhost", // 0.0.0.0 localhost
        port: 1212,
        overlay: {
            warnings: false,
            errors: true
        }
    },
    devtool: "eval-source-map"
};

module.exports = merge(baseConfig, devConfig);
