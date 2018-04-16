const path = require('path');
const webpack = require('webpack');
// const uglify = require('uglifyjs-webpack-plugin'); //压缩js这个功能在webpack4.0 已经形成0配置了。
const HTMLWebpackPlugin = require('html-webpack-plugin'); //生成简单的html文件
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //分离css
const extractPlugin = new ExtractTextPlugin({
    filename: '[name].css',
    ignoreOrder: false
})

// 引入多页面文件列表
const { HTMLDirs } = require("./config.page.js");
// 通过 html-webpack-plugin 生成的 HTML 集合
let HTMLPlugins = [];
// 入口文件集合
let Entries = {}

// 生成多页面的集合
HTMLDirs.forEach((page) => {
    const htmlPlugin = new HTMLWebpackPlugin({
        filename: `${page}.html`,
        template: path.resolve(__dirname, `./src/html/${page}.html`),
        chunks: [page, 'commons'],
    });
    HTMLPlugins.push(htmlPlugin);
    Entries[page] = path.resolve(__dirname, `./src/js/${page}.js`);
})

module.exports = {
    //入口文件的配置
    entry: Entries,
    //出口文件的配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].js"
    },
    //模块的配置
    module: {
        rules: [{
                test: /\.css$/,
                use: extractPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "px2rem-loader",
                        options: {
                            remUni: 75,
                            remPrecision: 8
                        }
                    }],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.less$/,
                use: extractPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50
                    }
                }]
            }
        ]
    },
    plugins: [
        // new uglify(),
        // new webpack.HotModuleReplacementPlugin(),
        // new HTMLWebpackPlugin({
        //     minfy: {
        //         removeAttributeQuotes: true
        //     },
        //     hash: true,
        //     template: './src/index.html'
        // }),
        ...HTMLPlugins,
        extractPlugin
    ],
    //本地服务配置
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 8080
    }
}