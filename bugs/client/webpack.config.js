const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const staticClientPath = path.resolve(__dirname, 'static/client');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    entry: {
        domainWorker: './gameApp/src/domainWorkerStart.js',
        gameApp: './gameApp/src/index.js',
        adminApp: './adminApp/src/index.js',
        accountApp: './accountApp/src/index.js',
        resetPasswordApp: './resetPasswordApp/src/index.js',
        initialStylesGameApp: './gameApp/src/view/initialStyles.css',
        initialStylesAccountApp: './accountApp/src/view/initialStyles.css',
        initialStylesResetPasswordApp: './resetPasswordApp/src/view/initialStyles.css',
        initialStylesEmailVerificationPage: './emailVerificationPage/initialStyles.css',
    },
    output: {
        filename: '[name].js',
        path: staticClientPath,
        assetModuleFilename: '[hash][ext]',
        chunkFilename: 'chunk-[contenthash].js',
        clean: true
    },
    resolve: {
        alias: {
          "@common": path.resolve(__dirname, './common'),
          "@utils": path.resolve(__dirname, './gameApp/src/utils'),
          "@view": path.resolve(__dirname, './gameApp/src/view'),
          "@domain": path.resolve(__dirname, './gameApp/src/domain'),
          "@messages": path.resolve(__dirname, './gameApp/src/messages'),
        },
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /initialStyles\.css$/i,
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                        ],
                    },
                    {
                        test: /\.css$/i,
                        use: ["style-loader", "css-loader"],
                    },
                ],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.png$/i,
                type: 'asset/resource'
            }
        ],
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin(),
        new webpack.DefinePlugin({
            STATIC_CLIENT_PATH: '"static/client"'
        })
    ],
};