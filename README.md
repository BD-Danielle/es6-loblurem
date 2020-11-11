# Babel setup
### 第一步：在開發目錄下，初始化npm，並輸入相關屬性值，例如創建者署名
```
npm init
```
### 第二步：touch一個副檔名為babelrc的檔案，並建立內容如下：
```
{
  "presets": ["es2015", "stage-2"]
}
```
### 第三步：安裝所需的套件，無需安裝至 --save-dev
```
npm install babel-cli babel-register babel-preset-es2015 babel-preset-stage-2
```
### 第四步：babel你指定的檔案，並輸出至指定位置：
```
babel peekaboo.js -o babel/peekaboo.babel.js
```