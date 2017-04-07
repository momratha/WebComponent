const path = require('path');
const dist = path.resolve('./dist');

module.exports = {
    devtool: 'source-map',
    entry: {
        'autocomplete.js': './assets/components/autocomplete/autocomplete.js'
    },
    output: {
        path: path.resolve(dist, 'js/autocomplete/'),
        filename: '[name]'
    },

    module: {
        rules: [],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
    ]
};
