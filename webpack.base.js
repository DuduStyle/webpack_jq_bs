const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const isProd = process.env.NODE_ENV === "prod";

// 设置多页面
const setPWA = () => {
    const entry = {};
    const HtmlWebpackPlugins = [];
    const entryFiles = glob.sync(
        path.join(__dirname, "./src/pages/*/index.js")
    );
    console.log("entryFiles", entryFiles);
    Object.keys(entryFiles).map(index => {
        const entryFile = entryFiles[index];
        const match = entryFile.match(/src\/pages\/(.*)\/index\.js/);
        const pageName = match && match[1];
        entry[pageName] = entryFile;
        console.log("pageName", pageName, entry);
        HtmlWebpackPlugins.push(
            new HtmlWebpackPlugin({
                favicon: path.resolve(__dirname, "./src/public/favicon.ico"),
                filename: `${pageName}.html`,
                template: path.join(
                    __dirname,
                    `./src/pages/${pageName}/index.html`
                ),
                // inlineSource: ".css$",
                chunks: ["vendors", pageName],
                minify: {
                    html5: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: false,
                    minifyCSS: true,
                    minifyJS: true,
                    removeComments: false
                }
            })
        );

        return { entry, HtmlWebpackPlugins };
    });
    return {
        entry,
        HtmlWebpackPlugins
    };
};
let { entry, HtmlWebpackPlugins } = setPWA();
console.log("setPWA()", entry, HtmlWebpackPlugins);

if (isProd) {
    HtmlWebpackPlugins.push(
        new MiniCssExtractPlugin({
            filename:
                "css/" +
                (isProd ? "[name].[contenthash:8].min.css" : "[name].css"),
            chunkFilename:
                "css/" +
                (isProd
                    ? "[name].chunk.[contenthash:8].min.css"
                    : "[name].chunk.css")
        })
    );
}
module.exports = {
    entry,
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "js/" + (isProd ? "[name].[chunkhash].min.js" : "[name].js"),
        chunkFilename:
            "js/" +
            (isProd ? "[name].chunk.[chunkhash].min.js" : "[name].chunk.js"),
        publicPath: isProd ? "./" : ""
    },
    module: {
        rules: [
            {
                test: /\.(html|htm)$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            interpolate: true,
                            minimize: false
                        }
                    }
                ]
            },
            {
                test: /.(png|jpg|gif|jpeg)$/,
                use: [
                    "url-loader?limit=4096&name=[name]" +
                        (isProd ? ".[hash:8]" : "") +
                        ".[ext]&outputPath=img/",
                    "image-webpack-loader"
                ]
            },
            {
                test: /\.(webp)$/,
                use: [
                    "file-loader?&name=[name]" +
                        (isProd ? ".[hash:8]" : "") +
                        ".[ext]&outputPath=img/"
                ]
            },
            {
                test: /.(svg|woff|woff2|ttf|eot)(\?.*$|$)/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "font" + "[name]_[hash:8][ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(css)$/,
                use: [
                    isProd
                        ? {
                              loader: MiniCssExtractPlugin.loader,
                              options: {
                                  publicPath: "../"
                              }
                          }
                        : "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.(scss)$/,
                use: [
                    isProd
                        ? {
                              loader: MiniCssExtractPlugin.loader,
                              options: {
                                  publicPath: "../"
                              }
                          }
                        : "style-loader",
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: function() {
                                return [require("autoprefixer")];
                            }
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new FriendlyErrorsWebpackPlugin(),
        ...HtmlWebpackPlugins
    ]
};
