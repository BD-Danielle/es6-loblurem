### npm install Dependencies
```sh
npm i webpack webpack-cli -D
npm i css-loader -D
npm i style-loader -D
```


### webpack.config.js (No)
```sh
npx webpack ./src/main.js --mode=production
```
### webpack.config.js (Yes)
```sh
npx webpack
```

```javascript
export default function count(x, y){
  return x + y;
}

```