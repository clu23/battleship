const path = require('path');

module.exports = {
  mode: "production",
  entry: './src/modules/main.js',
  module: {
    rules: [
      { test: /\.css$/, use: "css-loader" },
      {
        test: /.(png|svg|jpg|jpeg|gif|mp3)$/i,
        type: 'asset/resource',
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'img/[name][hash][ext][query]',
  },
};