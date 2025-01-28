const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    devtool: "source-map",
    entry: {
        gameApp: './gameApp/src/index.js',
        adminApp: './adminApp/src/index.js',
        accountApp: './accountApp/src/index.js',
        initialStyles: './gameApp/src/view/initialStyles.css'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'static/client'),
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
    plugins: [new MiniCssExtractPlugin()],
};