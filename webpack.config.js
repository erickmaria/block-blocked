const webpack = require("webpack"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path'),
    dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '.env') });

const OUTPUT_DIR = './dist/public',
    OUTPUT_FILENAME = 'game/game.js',
    ENTRY_FILENAME = './dist/game/game.js';

module.exports = {
    mode: process.env.PROFILE,
    devtool: "inline-source-map",
    entry: ENTRY_FILENAME,
    output: {
        path: path.resolve(__dirname, OUTPUT_DIR),
        filename: OUTPUT_FILENAME
    },
    plugins: [
        new HtmlWebpackPlugin({title:process.env.PROJECT_NAME,filename: 'index.html'}),
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true),
            'EXPERIMENTAL': JSON.stringify(true),
            'PLUGIN_CAMERA3D': JSON.stringify(false),
            'PLUGIN_FBINSTANT': JSON.stringify(false),
            'FEATURE_SOUND': JSON.stringify(true)
        })
    ]
};