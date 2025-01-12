const path = require('path');

module.exports = {
    mode: 'development',
    devtool: "source-map",
    entry: {
        app: './bugs/client/app/src/index.js',
        adminApp: './bugs/client/adminApp/src/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'bugs/client/static/client'),
        assetModuleFilename: '[hash][ext]',
        clean: true
    },
    resolve: {
        alias: {
          "@utils": path.resolve(__dirname, './bugs/client/utils'),
          "@view": path.resolve(__dirname, './bugs/client/app/src/view'),
          "@domain": path.resolve(__dirname, './bugs/client/app/src/domain'),
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