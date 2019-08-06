const path = require('path');
const glob = require('glob');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProd = (process.env.NODE_ENV === 'prod');

// 设置多页面
const setPWA = () => {
    let entry = {};
    let plugins = [];
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
        plugins.push(
            new HtmlPlugin({
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

        return { entry, plugins };
    });
    return {
        entry,
        plugins
    };
};
let { entry, plugins } = setPWA();
console.log("setPWA()", entry, plugins);

if (isProd) {
    plugins.push(
        new MiniCssExtractPlugin({
            filename: 'css/' + (isProd ? '[name].[contenthash:8].min.css' : '[name].css'),
            chunkFilename: 'css/' + (isProd ? '[name].chunk.[contenthash:8].min.css' : '[name].chunk.css'),
        })
    );
}

module.exports = {
    entry: entry,
    output: {
        publicPath: isProd ? './' : '',
        path: path.resolve(__dirname, './dist'),
        filename: 'js/' + (isProd ? '[name].[chunkhash].min.js' : '[name].js'),
        chunkFilename: 'js/' + (isProd ? '[name].chunk.[chunkhash].min.js' : '[name].chunk.js'),
    },
    module: {
        rules: [
            // {
            //     test: require.resolve('jquery'),
            //     use: [{
            //         loader: 'expose-loader',
            //         options: 'jQuery'
            //     }, {
            //         loader: 'expose-loader',
            //         options: '$'
            //     }]
            // },
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
                test: /\.(png|jpg|jpe?g|gif)$/,
                use: ['url-loader?limit=4096&name=[name]' + (isProd ? '.[hash:8]' : '') + '.[ext]&outputPath=img/', 'image-webpack-loader']
            },
            {
                test: /\.(webp)$/,
                use: ['file-loader?&name=[name]' + (isProd ? '.[hash:8]' : '') + '.[ext]&outputPath=img/']
            },
            {
                test: /\.(svg|woff|woff2|ttf|eot)(\?.*$|$)/,
                loader: 'file-loader?name=font/[name].[hash:8].[ext]'
            },
            {
                test: /\.(css)$/,
                use: [isProd ? ({
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../'
                    }
                }) : 'style-loader', 'css-loader']
            },
            {
                test: /\.(scss)$/,
                use: [isProd ? ({
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../'
                    }
                }) : 'style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
                            return [
                                require('autoprefixer')
                            ];
                        }
                    }
                }, 'sass-loader']
            },
            // {
            //     enforce: 'pre',
            //     test: /\.js$/,
            //     include: [path.resolve(__dirname, 'src/pages'), path.resolve(__dirname, 'assets/js')], // 指定eslint检查的目录
            //     loader: 'eslint-loader'
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    },
    plugins: [
        ...plugins
    ]
};