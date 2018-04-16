import { join } from 'path';
import AutoPrefixer from 'autoprefixer';

const include = join(__dirname, 'src');

export default {
    entry: './src/demo/index',
    output: {
        path: join(__dirname, 'docs'),
        filename: 'bundle.js',
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include,
            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },

            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            //    parser: 'sass',
                            sourceMap: true,
                            plugins() {
                                return [AutoPrefixer];
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            precision: 8,
                            outputStyle: 'expanded',
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        contentBase: 'docs/',
    },
};
