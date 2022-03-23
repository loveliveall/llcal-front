/* eslint-disable */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (_, argv) => {
  const isProd = argv.mode === 'production';

  const baseConfig = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'source-map',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.js', '.ts', '.tsx'],
    },
    entry: path.resolve(__dirname, 'src/index'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].[contenthash].bundle.js',
      chunkFilename: '[name].[chunkhash].bundle.js',
      publicPath: '/',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.resolve(__dirname, './tsconfig.json'),
              },
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
      }),
    ],
  };

  if (isProd) {
    return baseConfig;
  }
  return {
    ...baseConfig,
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'build'),
      },
      hot: true,
      compress: true,
      historyApiFallback: true,
    },
  };
};
