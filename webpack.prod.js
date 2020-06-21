const webpack = require("webpack"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    nodeExternals = require('webpack-node-externals'),
    path = require('path'),
    dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const SERVER_OUTPUT_DIR = 'dist/server',
    GAME_OUTPUT_DIR = 'dist/public',
    SERVER_ENTRY_FILENAME = 'src/server/server.ts',
    GAME_ENTRY_FILENAME = 'src/game/game.ts',
    HTML_PLUGIN_COPY = 'src/web/assets',
    HTML_PLUGIN_TEMPLATE = 'src/web/template/index.html';

module.exports = [
    {
        target: "node",
        mode: process.env.PROFILE,
        devtool: "inline-source-map",
        entry: {
            server: path.resolve(__dirname, SERVER_ENTRY_FILENAME)
        },
        externals: [nodeExternals()],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        optimization: {
            minimize: true
        },
        output: {
            path: path.resolve(__dirname, SERVER_OUTPUT_DIR),
            filename: '[name].bundle.js'
        },
        node: {
            __dirname: false,
            __filename: false,
        }
    },
    {
        // target: "web",
        mode: process.env.PROFILE,
        devtool: "inline-source-map",
        entry: {
            game: path.resolve(__dirname, GAME_ENTRY_FILENAME)
        },
        // externals: [nodeExternals()],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, HTML_PLUGIN_COPY),
                        to: path.resolve(__dirname, `${GAME_OUTPUT_DIR}/assets`)
                    },
                ],
            }),
            new HtmlWebpackPlugin({
                title: process.env.PROJECT_NAME,
                template: path.resolve(__dirname, HTML_PLUGIN_TEMPLATE),
                filename: "index.html",
                inject: 'body',
                minify: true
            }),
            new webpack.DefinePlugin({
                'CANVAS_RENDERER': JSON.stringify(true),
                'WEBGL_RENDERER': JSON.stringify(true),
                'EXPERIMENTAL': JSON.stringify(true),
                'PLUGIN_CAMERA3D': JSON.stringify(false),
                'PLUGIN_FBINSTANT': JSON.stringify(false),
                'FEATURE_SOUND': JSON.stringify(true)
            })
        ],
        optimization: {
            minimize: true
        },
        output: {
            path: path.resolve(__dirname, GAME_OUTPUT_DIR),
            filename: 'game/[name].bundle.js'
        },
    }
];