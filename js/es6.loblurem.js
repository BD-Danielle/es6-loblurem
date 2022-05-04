/*
 * ========================================================================
 * Loblurem 1.1
 * Loblurem plugin for generating blurry text
 * YILING CHEN.
 * Copyright 2022, MIT License
 * How to use it:
 * see README.md
 * ========================================================================
 */

// Defined "self_lorem" in Global
let self_lorem;

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
  id = Math.random().toString(16).slice(2);
  // constructor
  constructor(selector) {
    self_lorem = this;
    this.selector = selector;
    this.rendering();
  }
  get buttons(){
    return this.selector.querySelectorAll("[data-loblurem-btn]");
  }
  get getDisplay(){
    return this.selector.getAttribute("data-loblurem-display");
  }
  get options(){
    let attributes = this.selector.getAttribute("data-loblurem").split("/");
    return {
      counts: Number.isInteger(parseInt(attributes[0])) ? parseInt(attributes[0]) : attributes[0].length, // Number
      contents: !Number.isInteger(parseInt(attributes[0])) ? attributes[0].split("") : [],
      fontSize: parseInt(attributes[1]), // Number
      lineHeight: parseInt(attributes[2]), // Number
      color: attributes[3], // String
      letterSpacing: parseInt(attributes[4]), // Number
      blur: parseInt(typeof attributes[5] == "undefined" ? 4 : attributes[5]), // Number
    }
  }
  
  set options(value){
    if(value){
      for (var key in value) {
        this.options[key] = value[key];
      }
    }
  }
  get svgWidth(){
    return this.selector.offsetWidth || this.selector.parentElement.offsetWidth;
  }
  get charsPerRow(){
    return Math.floor(this.svgWidth / (this.options.fontSize + this.options.letterSpacing)) - 1;
  }
  get lineHeight(){
    return this.options.fontSize + this.options.lineHeight;
  }
  randomizeNum(a, z) {
    return Math.floor(Math.random() * (z - a + 1)) + a;
  }
  shuffleArr(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
  glueArr(){
    let counts = this.options.counts;
    let charsPerSentence = Object.assign([], this.charsPerSentence);
    let charsPerSentence_ = [];
    while(counts > 0) {
      charsPerSentence.reduce((p, c, i, a)=> {
        if (p <= 0) a.splice(0); // eject early
        charsPerSentence_.push(c);
        counts = p - c;
        return counts;
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
  sortArrText(){
    let charsPerSentence = this.shuffleArr(this.glueArr());
    let marks = this.shuffleArr(this.marks);
    let contents = Object.assign([], this.options.contents);
    charsPerSentence = contents.length ? charsPerSentence.map(c=>contents.splice(0, c)):charsPerSentence.map(c=>this.shuffleArr(this.wordsSample).slice(0, c));
    if(!this.options.contents.length){
      charsPerSentence.map((c, i, a)=>{
        c.splice(-1, 1, marks[Math.floor(Math.random() * marks.length)]);
        if(i == a.length - 1) c.splice(-1, 1, this.comma);
      })
    };
    charsPerSentence = charsPerSentence.flat();
    this.selector.setAttribute("data-loblurem", `${charsPerSentence.join("")}/${this.options.fontSize}/${this.options.lineHeight}/${this.options.color}/${this.options.letterSpacing}/${this.options.blur}`);
    charsPerSentence = charsPerSentence.map((c, i, a)=>a.slice(i * this.charsPerRow, i * this.charsPerRow + this.charsPerRow)).filter(c=>c.length);
    return charsPerSentence;
  }
  generateStr() {
    let rowsTemplate = "";
    let offsetX = this.getOffsetX();
    let rows = this.sortArrText();
    let svgHeight = this.lineHeight * rows.length;
    // <text kerning="auto" font-family="Microsoft JhengHei" font-size="${this.options.fontSize}px" x="${offsetX}px" y="${this.lineHeight*(i+1) - 2}px" letter-spacing="${this.options.letterSpacing}px" font-size="${this.options.fontSize}px" fill="${this.options.color}">${c.join("")}</text>
    rows.forEach((c, i, a)=>{
      if(i==a.length-1){
        rowsTemplate += `
        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow${this.id})" font-size="${this.options.fontSize}px" x="${offsetX}px" y="${this.lineHeight*(i+1)-2}px" letter-spacing="${this.options.letterSpacing}px" font-size="${this.options.fontSize}px" fill="${this.options.color}">${c.join("")}</text>
        `
      }else{
        rowsTemplate += `
        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow${this.id})" font-size="${this.options.fontSize}px" x="${offsetX}px" y="${this.lineHeight*(i+1)-2}px" letter-spacing="${this.options.letterSpacing}px" textLength="${this.svgWidth}" font-size="${this.options.fontSize}px" fill="${this.options.color}">${c.join("")}</text>
        `; 
      }
    })
    return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${this.svgWidth}px" height="${svgHeight+7}px" display="block">
      <filter id="drop-shadow${this.id}"><feGaussianBlur stdDeviation="${this.options.blur}"></feGaussianBlur></filter>
        ${rowsTemplate}
    </svg>
    `;
  }

  
  getOffsetX() {
    let offsetX;
    switch (this.getDisplay) {
      case "middle":
        offsetX = this.svgWidth / 2 - (this.options.fontSize * this.options.counts + this.options.letterSpacing * (this.options.counts - 1)) / 2;
        break;
      case "right":
        offsetX = this.svgWidth - (this.options.fontSize * this.options.counts + this.options.letterSpacing * (this.options.counts - 1)) - 3;
        break;
      default:
        offsetX = 2.5;
    }
    return offsetX;
  }
  centreBtn() {
    if (!this.buttons.length) return;
    this.selector.style.position = "relative";
    let svgHeight = this.lineHeight * this.sortArrText().length;
    let offsetTop = this.selector.offsetHeight-svgHeight; //660
    let offsetHeight = [...this.buttons].map(c=>c.offsetHeight);
    let iterateOffsetHeight = offsetHeight.reduce((p, c)=>{
      if(!p.length)p.push(c);
      let next = p[p.length-1];
      p.push(next+c);
      return p;
    }, [0]);
    console.log('iterateOffsetHeight: ', iterateOffsetHeight);//[0, 55, 84, 113, 142] iphone12 pro
    let baseline = offsetTop+(svgHeight-this.buttons[0].offsetHeight)/2;
    this.buttons.forEach((c, i)=>{
      c.style.top = baseline+iterateOffsetHeight[i] + "px";
      c.style.position = "absolute";
      c.style.left = "50%";
      c.style.transform = "translate(-50%, 0)";
      c.style.zIndex = 1;
      c.style.margin = 0;
    });
  }
  rendering() {
    this.selector.style.userSelect = "none";
    this.selector.innerHTML += this.generateStr();
    this.centreBtn();
  }
};
window.addEventListener("DOMContentLoaded", function () {
  let selectors = document.querySelectorAll("[data-loblurem]");
  selectors.forEach(c=>new Loblurem(c));
  window.addEventListener("resize", function(){
    selectors.forEach(c=>{
      c.lastElementChild.remove();
      new Loblurem(c);
    });
  })
})

