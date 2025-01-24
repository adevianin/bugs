const path = require('path');

module.exports = {
    mode: 'development',
    devtool: "source-map",
    entry: {
        app: './app/src/index.js',
        adminApp: './adminApp/src/index.js'
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
          "@utils": path.resolve(__dirname, './utils'),
          "@view": path.resolve(__dirname, './app/src/view'),
          "@domain": path.resolve(__dirname, './app/src/domain'),
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
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
};