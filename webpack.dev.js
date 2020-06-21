const webpack = require("webpack"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
    path = require('path'),
    dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const OUTPUT_DIR = 'dist/public',
    ENTRY_FILENAME = 'src/game/game.ts',
    HTML_PLUGIN_COPY = 'src/web/assets',
    HTML_PLUGIN_TEMPLATE = 'src/web/template/index.html';

module.exports = {
    mode: process.env.PROFILE,
    devtool: "inline-source-map",
    entry: {
        game: path.resolve(__dirname, ENTRY_FILENAME)
    },
    watch: true,
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
                    to: path.resolve(__dirname, `${OUTPUT_DIR}/assets`)
                },
            ],
        }),
        new HtmlWebpackPlugin({
            title: process.env.PROJECT_NAME,
            template: path.resolve(__dirname, HTML_PLUGIN_TEMPLATE),
            filename: "index.html",
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true),
            'EXPERIMENTAL': JSON.stringify(true),
            'PLUGIN_CAMERA3D': JSON.stringify(false),
            'PLUGIN_FBINSTANT': JSON.stringify(false),
            'FEATURE_SOUND': JSON.stringify(true)
        }),
        new BrowserSyncPlugin({
            cors: false,
            ui: false,
            host: process.env.HOST || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: [path.resolve(__dirname, OUTPUT_DIR)]
            }
        })
    ],
    output: {
        path: path.resolve(__dirname, OUTPUT_DIR),
        filename: "game/[name].bundle.js"
    },
};