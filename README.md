# Loblurem
## 羅伯崙套件，可進行區塊性模糊字渲染，其渲染的文字內容可隨機 (預設值)，或依使用者喜好。

## Prerequisites 必要條件：
### loblurem 不依賴原生jQuery，引用之前不需先載入jQuery
 ```
  <script src="./js/es6.loblurem.js"></script>
 ```

## Configuration 參數配置：
### 在需模糊的區域，加載屬性節點 data-loblurem，其屬性值可依使用者需求配置，其順序依次為 - > 字數(或自行輸文本)/字型大小/行間間距/字型顏色/字元間距/模糊程度預設為值4
```
  <p class="pq_TXT3" data-loblurem="157w/20/10/rgb(87, 132, 84)/5"> 歷經幾段感情之後遇見了他，我們一點都不速配，身高、年齡、收入...
    <span>
      <a data-loblurem-btn class="pq_BT_FREE1" href="#">立即測算</a>
      <a data-loblurem-btn href="">付費後將提供本單元整頁分析內容</a>
    </span>
  </p>
```
### 模糊字渲染預設值為隨機，如需客製需增加自定義的文檔，範例如下：
```
  <div class="pq_RETEXT" data-loblurem="大弦嘈嘈如急雨，小弦切切如私語。嘈嘈切切錯雜彈，大珠小珠落玉盤。間關鶯語花底滑，幽咽泉流冰下難。冰泉冷澀弦疑絕，疑絕不通聲暫歇。別有幽愁暗恨生，此時無聲勝有聲。/20/10/#c93030/0"
  </div>
```
![範例圖檔](/images/loblurem/examples1.png?raw=true "Title")

### 不適用大區塊段落文字模糊字定位，只適用標題，預設值為靠左，如需客製需增加 data-loblurem-display 屬性節點，和屬性值，範例如下：
```
  <div class="pq_TWO_COM">
    <div class="pq_REPIC" data-loblurem="我反中，你怎樣/20/10/#c430c9/5" data-loblurem-display="right"></div>
  </div>
```
* data-loblurem-display: left; (預設值)
* data-loblurem-display: middle;
* data-loblurem-display: right (不適用大區塊段落文字);
  
![範例圖檔](/images/loblurem/examples2.png?raw=true "Title")
![範例圖檔](/images/loblurem/examples3.png?raw=true "Title")

### 模糊區段的按鈕可以多個並排，但需逐鍵增加data-loblurem-btn，並置中，範例如下：
```
<p class="pq_TXT3" data-loblurem="貼心提醒：盧恩石占卜過程皆為動畫，建議您在網路穩定的環境中操作， 以獲得最佳的占卜體驗與視覺效果唷！貼心提醒：盧恩石占卜過程皆為動畫，建議您在網路穩定的環境中操作， 以獲得最佳的占卜體驗與視覺效果唷！貼心提醒：盧恩石占卜過程皆為動畫，建議您在網路穩定的環境中操作， 以獲得最佳的占卜體驗與視覺效果唷！/20/10/rgb(87, 132, 84)/5">
  <span>
    <a data-loblurem-btn class="pq_BT_FREE1" href="#">1.立即測算</a>
    <a data-loblurem-btn href="">2.付費後將提供</a>
    <a data-loblurem-btn href="">3.本單元整頁</a>
    <a data-loblurem-btn href="">4.分析內容</a>
  </span>
</p>
```
![範例圖檔](/images/loblurem/examples4.png?raw=true "Title")
