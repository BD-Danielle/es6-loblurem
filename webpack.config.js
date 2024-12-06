const path = require('path');
const {name, version} = require('./package.json'); // 引入package.json文件

module.exports = {
  mode: 'production', //development
  entry: `./js/${name}${version}.js`, // 動態設定入口文件
  output: {
    path: path.resolve(__dirname, './js/webpack'),
    filename: `${name}.bundle${version}.js`, // 動態設定輸出檔名
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 使用正規表示式來匹配需要轉換的文件
        exclude: /node_modules/, // 排除不需要轉換的文件
        use: {
          loader: 'babel-loader', // 使用 babel-loader 進行轉換
          options: {
            presets: ['@babel/preset-env'], // 使用 @babel/preset-env 進行轉換
          }
        }
      }
    ]
  }
}
