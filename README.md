# Loblurem 1.2.1

Loblurem is a JavaScript plugin designed for generating blurry text effects. It was created by YILING CHEN and is distributed under the MIT License.

## Table of Contents

- [Usage](#usage)
- [Options](#options)
- [Initialization](#initialization)
- [License](#license)

## Usage

To use Loblurem, follow these steps:

1. Include the Loblurem script in your HTML file:

   ```html
   <script src="path/to/es6.main.loblurem.bundle.js"></script>
   ```
2. Add the data-loblurem attribute to the HTML element where you want to apply the blurry text effect:
   
   ```html
   <p class="pq_TXT3" data-loblurem="157w/20/10/rgb(87, 132, 84)/5"> 歷經幾段感情之後遇見了他，我們一點都不速配，身高、年齡、收入...
      <span>
         <a data-loblurem-btn class="pq_BT_FREE1" href="#">立即測算</a>
         <a data-loblurem-btn href="">付費後將提供本單元整頁分析內容</a>
      </span>
   </p>
   ```
3. Add the data-loblurem-display attribute to the HTML element where you want to apply the position of the blurry text effect:
   ```html
   <p data-loblurem="前端測試中/40/10/#d39a15/5/7" data-loblurem-display="middle"></p>
   ```

4. Ensure the `Microsoft JhengHei` font is available in your project, as it is used for rendering the text.

5. Loblurem will automatically apply the blurry text effect to the specified element when the page loads.


## Options

The `data-loblurem` attribute supports the following options:

- **Counts**: Number of characters in the generated text.
- **Contents**: Custom characters for the text (if not specified, random Chinese characters will be used).
- **FontSize**: Font size of the text.
- **LineHeight**: Line height of the text.
- **Color**: Color of the text.
- **LetterSpacing**: Letter spacing of the text.
- **Blur**: Amount of blur applied to the text.

Example:
```html
<div data-loblurem="counts/contents/fontSize/lineHeight/color/letterSpacing/blur" data-loblurem-display="..."></div>
```

## Initialization

Loblurem is initialized automatically when the DOM content is loaded. If you dynamically add elements with the data-loblurem attribute.

## License

Loblurem is licensed under the MIT License. See [LICENSE](https://opensource.org/license/mit/) for more details.