var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var isProduction = process.env.NODE_ENV === 'production';

var plugins = [
  // new ExtractPlugin('bundle.css'),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'main',
    children: true,
    minChunks: 2,
  }),
];


if (isProduction) {
  plugins = plugins.concat([
    // Cleanup the builds/ folder before
    // compiling our final assets
    new CleanPlugin('builds'),

    // This plugin looks for similar chunks and files
    // and merges them for better caching by the user
    new webpack.optimize.DedupePlugin(),

    // This plugins optimizes chunks and modules by
    // how much they are used in your app
    new webpack.optimize.OccurenceOrderPlugin(),

    // This plugin prevents Webpack from creating chunks
    // that would be too small to be worth loading separately
    new webpack.optimize.MinChunkSizePlugin({
      // ~50kb
      minChunkSize: 51200,
    }),

    // This plugin minifies all the Javascript code of the final bundle
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
      },
    }),

    // This plugins defines various variables that we can set to false
    // in production to avoid code related to them from being compiled
    // in our final bundle
    new webpack.DefinePlugin({
      __SERVER__: !isProduction,
      __DEVELOPMENT__: !isProduction,
      __DEVTOOLS__: !isProduction,
      'process.env': {
        BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]);
}


module.exports = {
  entry: './app',
  plugins: plugins,

  output: {
    path: 'builds',
    filename: isProduction ? '[name]-[hash].js' : 'bundle.js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'builds/',
  },

  module: {
    preLoaders: [{
      test: /\.js/,
      loader: 'eslint',
    }, {
      test: /\.js/,
      loader: 'baggage?[file].html=template&[file].less',
    }],

    loaders: [{
      test: /\.js/,
      loader: 'babel',
      include: __dirname + '/app',
    }, {
      test: /\.less/,
      // loader: ExtractPlugin.extract('style', 'css!less'),
      loaders: [ 'style', 'css', 'less' ],
    }, {
      test: /\.html/,
      loader: 'html',
    }, {
      test: /\.(png|gif|jpe?g|svg)$/i,
      loader: 'url',
      query: { limit: 10000 },
    }],
  },

  devServer: {
    hot: false,
    port: 8181,
    inline: true,
  },
};
