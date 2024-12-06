# Loblurem 2.0.0

Loblurem 是一個用於生成模糊文字效果的 JavaScript 套件。它支援自訂文字內容、字體大小、行高、顏色和模糊程度等特性，並提供了文字對齊方式的控制。

## 功能特點

- 支援自訂文字內容和隨機中文字元生成
- 自適應容器寬度，自動換行
- 支援靠左、置中和靠右對齊
- 可自訂字體大小、行高、字距
- 支援自訂文字顏色和模糊效果
- 響應式設計，支援視窗大小變化
- 支援 Microsoft JhengHei 字體

## 安裝

將編譯後的檔案引入您的 HTML：

```html
<script src="path/to/es6.main.loblurem.bundle2.0.0.js"></script>
```

## 使用方法

### 基本用法

1. 添加 data-loblurem 屬性到 HTML 元素：

```html
<div data-loblurem="157w/20/10/rgb(87, 132, 84)/5"></div>
```

2. 添加 data-loblurem-display 屬性控制對齊方式：

```html
<div data-loblurem="測試文字/20/10/#000000/5" data-loblurem-display="right"></div>
```

### data-loblurem 屬性參數

屬性值使用斜線(/)分隔，按順序包含以下參數：

1. `content/counts`: 文字內容或字數（如：`"測試文字"` 或 `"157w"`）
2. `fontSize`: 字體大小（單位：像素）
3. `lineHeight`: 行高
4. `color`: 文字顏色（支援 RGB、十六進位等格式）
5. `letterSpacing`: 字距
6. `blur`: 模糊程度（可選）

### data-loblurem-display 屬性值

- `left`: 靠左對齊（預設）
- `middle`: 置中對齊
- `right`: 靠右對齊

### 範例

```html
<!-- 靠右對齊範例 -->
<div data-loblurem="我是測試文字/20/10/#000000/5" data-loblurem-display="right"></div>

<!-- 置中對齊範例 -->
<div data-loblurem="157w/20/10/rgb(87, 132, 84)/5" data-loblurem-display="middle"></div>

<!-- 帶按鈕的範例 -->
<p class="pq_TXT3" data-loblurem="157w/20/10/rgb(87, 132, 84)/5">
    文字內容...
    <span>
        <a data-loblurem-btn class="pq_BT_FREE1" href="#">按鈕文字</a>
    </span>
</p>
```

## 瀏覽器支援

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 相依性

- 需要 Microsoft JhengHei 字體支援

## 授權條款

MIT License

## 更新日誌

### 2.0.0
- 使用 ES2024 特性重構
- 新增文字對齊功能
- 優化效能和程式碼結構
- 改進錯誤處理
- 新增事件支援
- 優化字體載入機制

### 1.2.1
- 初始版本發布