/*
 * ========================================================================
 * Loblurem 1.1
 * Loblurem plugin for generating blurry text
 * YILING CHEN.
 * Copyright 2019, MIT License
 * How to use it:
 * see README.md
 * ========================================================================
 */

// Defined "self_lorem" in Global
let self_lorem;
// Create a ES6 Class
class Loblurem {
  // **********Static variables********** //
  charsPerSentence = [7, 8, 9, 10, 11, 12, 13];
  // Words list
  wordsSample = [
    '心', '戶', '手', '文', '斗', '斤', '方', '日', '月', '木', //4
    '令', '北', '本', '以', '主', '充', '半', '失', '巧', '平', //5
    '在', '回', '休', '交', '至', '再', '光', '先', '全', '共', //6
    '邱', '附', '怖', '長', '使', '其', '非', '並', '刻', '取', //8
    '既', '洋', '拜', '面', '促', '前', '飛', '亮', '信', '香', //9
    '班', '借', '家', '勉', '冠', '英', '苦', '為', '段', '派', //10
    '荷', '推', '區', '停', '假', '動', '健', '夠', '問', '將', //11
    '傻', '勢', '亂', '傷', '圓', '傲', '照', '滄', '溺', '準', //13
    '境', '厭', '像', '夢', '奪', '摘', '實', '寧', '管', '種', //14
    '褪', '選', '隨', '憑', '導', '憾', '奮', '擋', '曉', '暸', //16
    '懷', '穩', '曠', '邊', '難', '願', '關', '壞', '爆', '攏'  //19
  ];
  // Punches list
  marks = ["，", "？", "！", "、", "。"];
  comma = "。";
  // constructor
  constructor(selector) {
    this.selector = selector;
    this.generate();
    this.onresize();
  }
  get id(){
    return "id" + Math.random().toString(16).slice(2);
  }
  get styles(){
    return {
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, 0)",
      zIndex: 1,
      margin: 0
    }
  }
  set styles(obj){
    this.selector.style[obj.key] = obj.value;
  }
  get buttons(){
    return this.selector.querySelectorAll("data-loblurem-btn");
  }
  get hasDisplay(){
    return this.selector.hasAttribute("data-loblurem-display");
  }
  get getDisplay(){
    return this.selector.getAttribute("data-loblurem-display");
  }
  get options(){
    return {
      "counts": Number.isInteger(parseInt(this.attribute[0])) ? parseInt(this.attribute[0]) : this.attribute[0].length, // Number
      "contents": !Number.isInteger(parseInt(this.attribute[0])) ? this.attribute[0] : this.glueWords(), // String
      "fontSize": parseInt(this.attribute[1]), // Number
      "lineHeight": parseInt(this.attribute[2]), // Number
      "color": this.attribute[3], // String
      "letterSpacing": parseInt(this.attribute[4]), // Number
      "blur": parseInt(typeof this.attribute[5] == "undefined" ? 4 : split[5]), // Number
      "svgWidth": this.selector.offsetWidth || this.selector.parentElement.offsetWidth,
      "charsPerRow": Math.floor(this.options.svgWidth / (this.options.fontSize + this.options.letterSpacing)) - 1,
      "charsLineHeight": this.options.fontSize * this.charsPerRow.length + this.options.lineHeight * (this.charsPerRow.length == 1 ? 1 : this.charsPerRow.length - 1),
    };
  }
  set options(obj){
    this.options[obj.key] = obj.value;
  }
  get attribute(){
    return this.selector.getAttribute("data-loblurem").split("/");
  }
  set attribute(value){
    this.attribute.splice(0, 1, value);
    this.selector.setAttribute("data-loblurem", this.attribute.join(""));
  }
  randomizeNum(a, z) {
    return Math.floor(Math.random() * (z - a + 1)) + a;
  }
  shuffleArr(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
  // Get the rest number to add to another number
  // [9, 10, 12, 13, 11, 8, 7, 9, 10, 12, 13, 11, 8, 7, 9, 8]
  spliceArr(arr, min) {
    let theRest = arr.filter(c => c < min);
    let theMain = arr.filter(c => c >= min);
    let idx = theMain.indexOf(Math.min.apply(Math, theMain));
    theRest.map(c => theMain[idx] += c);
    return theMain;
  }
  glueArr(){
    let counts = this.options.counts;
    let charsPerSentence_ = [];
    while(counts > 0) {
      this.charsPerSentence.reduce((p, c, i, a)=> {
        if (p <= 0) {
          a.splice(0); // eject early
        } else {
          charsPerSentence_.push(c);
          counts = p - c;
          return counts;
        }
      }, counts);
    }
    charsPerSentence_.sort((a, z) => z - a); // z to a
    while(counts < 0){
      for(let i = 0; i < charsPerSentence_.length; i++){
        charsPerSentence_[i]-=1;
        counts+=1;
        if(counts >=0) break;
      }
    }
    return charsPerSentence_; // [12, 12, 12, 12, 11, 11, 10, 10, 9, 9, 8, 8, 7, 7, 7]
  }
  glueTextArr(){
    let charsPerSentence = this.shuffleArr(this.glueArr());
    let marks = this.shuffleArr(this.marks);
    charsPerSentence = charsPerSentence.map(c=>this.shuffleArr(this.wordsSample).slice(0, c));
    charsPerSentence.map((c, i, a)=>{
      c.splice(-1, 1, marks[Math.floor(Math.random() * marks.length)]);
      if(i == a.length - 1) c.splice(-1, 1, this.comma);
    })
    charsPerSentence = charsPerSentence.flat();
    charsPerSentence = charsPerSentence.map((c, i, a)=>a.slice(i * this.options.charsPerRow, i * this.options.charsPerRow + this.options.charsPerRow)).filter(c=>c.length);
    return charsPerSentence;
  }
  
  generateTemplate() {
    let rowsTemplate = '';
    let rows = this.glueTextArr();
    let offsetX = this.getOffsetX();
    rows.forEach((c, i, a)=>{
      rowsTemplate += `
      <text kerning="auto" font-family="Microsoft JhengHei" font-size="${this.options.fontSize}px" x="${offsetX}px" y="${this.options.charsLineHeight*(i+1) - 2}px" letter-spacing="${this.options.letterSpacing}px" font-size="${this.options.fontSize}px" fill="${this.options.color}">${c.join("")}</text>
      <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow${this.id})" font-size="${this.options.fontSize}px" x="${textWidth}px" y="${this.options.charsLineHeight*(i+1) - 2}px" letter-spacing="${this.options.letterSpacing}px" textLength="${this.options.svgWidth}" font-size="${this.options.fontSize}px" fill="${this.options.color}">${c.join("")}</text>
      `; 
      if(i==a.length-1){
        rowsTemplate += `
        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow${this.id})" font-size="${this.options.fontSize}px" x="${offsetX}px" y="${this.options.charsLineHeight*(i+1) - 2}px" letter-spacing="${this.options.letterSpacing}px" font-size="${this.options.fontSize}px" fill="${this.options.color}">${c.join("")}</text>
        `
      }
    })

    return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${this.options.svgWidth}px" height="${this.options.charsLineHeight + 7}px" display="block">
      <filter id="drop-shadow${this.id}"><feGaussianBlur stdDeviation="${(typeof this.options.blur == "undefined") ? 4 : this.options.blur}" result="drop-shadow"></feGaussianBlur></filter>
        ${rowsTemplate}
    </svg>
    `;
  }

  
  getOffsetX() {
    let offsetX = 3;
    if (this.hasDisplay && this.getDisplay.length > 0) {
      switch (this.getDisplay) {
        case "middle":
          offsetX = this.options.svgWidth / 2 - (this.options.fontSize * this.options.counts + this.options.letterSpacing * (this.options.counts - 1)) / 2;
          break;
        case "right":
          offsetX = this.options.svgWidth - (this.options.fontSize * this.options.counts + this.options.letterSpacing * (this.options.counts - 1)) - 3;
          break;
        default:
          return offsetX = 3;
      }
    } 
    return offsetX;
  }
  centreBtn() {
    if (!this.buttons) return;
    for (let key in this.styles){this.selector.style[key] = this.styles[key]};
    buttons.forEach(c => {
      let top = this.selector.offsetHeight - self_lorem.options.charsLineHeight / 2 - c.offsetHeight / 2 + "px" 
      c.style.top = top;
    });
    this.selector.style.position = "relative";
  }
  removeElement() {
    this.selector.lastElementChild.remove();
  }
  generate() {
    this.selector.style.userSelect = "none";
    this.selector.innerHTML += this.glueWords();
    this.centreBtn();
  }
  onresize(){
    window.addEventListener("resize", function(){
      self_lorem.removeElement();
      self_lorem.generate();
    })
  }
};
window.addEventListener('DOMContentsLoaded', function () {
  let selectors = document.querySelectorAll('[data-loblurem]');
  selectors.forEach(c=>new Loblurem(c));
})

