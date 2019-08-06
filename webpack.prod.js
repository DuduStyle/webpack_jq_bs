const baseConfig = require("./webpack.base");
const merge = require("webpack-merge");
const cssnano = require("cssnano");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const prodConfig = {
    mode: "production",
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/" + "[name].[contenthash:8].min.css",
            chunkFilename: "css/" + "[name].chunk.[contenthash:8].min.css"
        }),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnano
        }),
        new webpack.BannerPlugin(
            "CopyRight © 2015-2028 All Right Reserved SmartMe Technology Co.,Ltd"
        )
    ],
    optimization: {
        minimize: true,
        splitChunks: {
            minSize: 0,
            minChunks: 1,
            maxAsyncRequests: 50,
            maxInitialRequests: 30,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -1,
                    chunks: "all",
                    name: "vendors"
                }
                // easyui: {
                //     test: path.resolve(__dirname, './src/assets/libs/jquery-easyui'),
                //     priority: -5,
                //     chunks: 'initial',
                //     name: 'easyui'
                // },
                // echarts: {
                //     test: path.resolve(__dirname, './src/assets/libs/echarts'),
                //     priority: -6,
                //     chunks: 'initial',
                //     name: 'echarts'
                // },
                // assets: {
                //     test: path.resolve(__dirname, './src/assets'),
                //     priority: -10,
                //     chunks: 'all',
                //     name: 'assets'
                // }
            }
        }
    }
};

module.exports = merge(baseConfig, prodConfig);
