/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

const cssLoaderConfig = {
  loader: 'css-loader',
  options: {
    modules: {
      auto: true,
      namedExport: false,
      localIdentName: '[folder]_[local]--[hash:base64:5]',
    },
  },
};

const postcss = {
  loader: 'postcss-loader',
};

const ASSET_PATH = process.env.BUILD_CDN_PREFIX || 'auto';

module.exports = {
  devtool: isProduction ? false : 'eval-source-map',
  entry: './example-web/app.tsx',
  output: {
    filename: 'static/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist', 'web'),
    assetModuleFilename: 'images/[hash][ext][query]',
    publicPath: ASSET_PATH,
    clean: true,
  },
  devServer: {
    hot: false,
    open: true,
    compress: true,
    port: 3010,
    client: {
      overlay: false,
      progress: true,
    },
  },
  cache: {
    type: 'filesystem',
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              target: 'es2017',
              parser: {
                syntax: 'typescript',
                jsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  useBuiltins: true,
                },
              },
            },
          },
        },
      },
      {
        test: /\.less$/i,
        use: [MiniCssExtractPlugin.loader, cssLoaderConfig, postcss, 'less-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, cssLoaderConfig],
      },
      {
        test: /\.a?png/,
        type: 'asset/resource',
      },
      {
        test: /\.svg/,
        type: 'asset/resource',
      },
      {
        test: /\.jpe?g/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.wasm'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/[id].[contenthash].css',
      ignoreOrder: true,
    }),
    new HtmlWebpackPlugin(),
  ],
};
