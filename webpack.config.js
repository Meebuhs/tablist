const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: {
        popup: path.join(__dirname, 'src', 'js', '/popup.js')
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {}
                    },
                    {
                        loader: 'sass-loader',
                        options: {}
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['build']),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/manifest.json',
                transform: function (content, path) {
                    return Buffer.from(JSON.stringify({
                        description: process.env.npm_package_description,
                        version: process.env.npm_package_version,
                        ...JSON.parse(content.toString())
                    }))
                }
            },
            {
                from: 'src/images',
                to: 'images'
            }
        ]),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'popup.html'),
            filename: 'popup.html',
            chunks: ['popup']
        })
    ]
};