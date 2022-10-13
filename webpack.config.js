const path = require('path');

module.exports = {
    mode: 'development',
    entry: './bugs/core/client/src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'bugs/core/static/core'),
    },
};