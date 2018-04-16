import webpack from 'webpack';
import { join } from 'path';
import AutoPrefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const isProd = (process.env.NODE_ENV === 'production');

const include = join(__dirname, 'src');

export default {
    entry: './src/demo/index',

    output: {
        path: join(__dirname, 'docs'),
        filename: 'bundle.js',
    },

    devtool: isProd ? '' : 'source-map',
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
                /*use: [
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
                        },
                    },
                ],*/
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true,
                                importLoaders: 2,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
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
                            },
                        },
                    ],
                }),
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: process.env.NODE_ENV,
        }),
        new ExtractTextPlugin({
            filename: '../src/styles/reactour.css',
            disable: !isProd,
        }),
    ],
    devServer: {
        contentBase: 'docs/',
    },
};
