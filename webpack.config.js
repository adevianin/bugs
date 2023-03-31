const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        app: './bugs/core/client/app/src/index.js',
        adminApp: './bugs/core/client/adminApp/src/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'bugs/core/static/core'),
    },
    resolve: {
        alias: {
          utils: path.resolve(__dirname, './bugs/core/client/utils'),
        },
    },
};