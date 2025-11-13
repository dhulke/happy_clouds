const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    new HtmlWebpackPlugin({
      template: './src/privacy-policy.html',
      filename: 'privacy-policy.html',
      inject: false
    }),
    new HtmlInlineScriptPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'resources/favicon.ico',
          to: 'favicon.ico'
        },
        {
          from: 'resources/sitemap.xml',
          to: 'sitemap.xml'
        },
        {
          from: 'resources/robots.txt',
          to: 'robots.txt'
        }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    port: 8080,
    open: true
  }
};