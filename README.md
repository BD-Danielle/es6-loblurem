# Loblurem
## 羅伯崙套件，可進行區塊性模糊字渲染，其渲染的文字內容可隨機 (預設值)，或依使用者喜好。

## Getting Started 開始使用：
### 詳情請參照下面敍述

## Prerequisites 必要條件：
### loblurem 需依賴原生jQuery，引用之前必需先載入jQuery
 ```
  <script src="./js/jquery-2.0.3/jquery.min.js"></script>
  <script src="./js/loblurem.js"></script>
 ```

## Configuration 參數配置：
### 在需模糊的區域，加載屬性節點 data-boblurem，其屬性值可依使用者需求配置，其順序依次為 - > 字數/字型大小/行間間距/字型顏色/字元間距/模糊程度預設為值4
```
  <p class="pq_TXT3" data-loblurem="157w/20/10/rgb(87, 132, 84)/5"> 歷經幾段感情之後遇見了他，我們一點都不速配，身高、年齡、收入...
    <span>
      <a data-loblurem-btn class="pq_BT_FREE1" href="#">立即測算</a>
      <a data-loblurem-btn href="">付費後將提供本單元整頁分析內容</a>
    </span>
  </p>
```
### 模糊字渲染預設值為隨機，如需客製需增加 data-loblurem-plain 屬性節點，和屬性值，範例如下：
```
  <div class="pq_RETEXT" data-loblurem="5W/20/10/#c93030/0"
    data-loblurem-plaintext="大弦嘈嘈如急雨，小弦切切如私語。嘈嘈切切錯雜彈，大珠小珠落玉盤。間關鶯語花底滑，幽咽泉流冰下難。冰泉冷澀弦疑絕，疑絕不通聲暫歇。別有幽愁暗恨生，此時無聲勝有聲。"
  </div>
```
![範例圖檔](/images/loblurem/examples1.png?raw=true "Title")

### 模糊字定位預設值為靠左，如需客製需增加 data-loblurem-display 屬性節點，和屬性值，不適用大區塊段落文字，範例如下：
```
  <div class="pq_TWO_COM">
    <div class="pq_REPIC" data-loblurem="6W/20/10/#c430c9/5" data-loblurem-display="middle"></div>
  </div>
```
* data-loblurem-display: left; (預設值)
* data-loblurem-display: middle;
* data-loblurem-display: right (不適用大區塊段落文字);
  
![範例圖檔](/images/loblurem/examples2.png?raw=true "Title")
## Built with 套件參與者
* [cyl]() - 代碼撰寫
* [Kej]() - 代碼撰寫，代碼復盤
* [Uniza]() - 代碼撰寫
