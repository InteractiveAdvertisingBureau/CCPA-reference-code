const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');

// * * * * * Common Config * * * * * //

const commonConfig = (env) => {
  return {
    entry: {
      uspapi: './src/uspapi.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'build', env)
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: './index.html',
        minify: {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true
        }
      })
    ]
  };
};

const envSpecificConfig = (env) =>
  env == 'dev'
    ? // ***** Development Config ***** //
      {
        devServer: {
          index: './index.html',
          openPage: './index.html',
          hot: true,
          /* allows /etc/hosts 127.0.0.1 sub.domain.local devserver access for Cookie Domain testing */
          disableHostCheck: true
        },
        plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NamedModulesPlugin()
        ]
      }
    : // ***** Production Config ***** //
      {
        plugins: [
          new CleanWebpackPlugin([path.resolve('build', env)]),
          // new UglifyJSPlugin()
        ]
      };

// ***** Environment Config ***** //

module.exports = env => {
  return merge(
    commonConfig(env),
    envSpecificConfig(env)
  );
};
