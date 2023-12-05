/*
 * ========================================================================
 * Loblurem 1.2.1
 * Loblurem plugin for generating blurry text
 * YILING CHEN.
 * Copyright 2022, MIT License
 * How to use it:
 * see README.md
 * ========================================================================
 */

var self_lorem;
class Loblurem {
  static DEFAULT_THROTTLE_DELAY = 250;
  static DEFAULT_BLUR = 4;
  static DEFAULT_OFFSET_X = 2.5;
  charsPerSentence = [7, 8, 9, 10, 11, 12, 13];
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
  marks = ["，", "？", "！", "、", "。"];
  comma = "。";
  id = Math.random().toString(16).slice(2);

  constructor(selector) {
    self_lorem = this;
    this.selector = selector;
    this.resizeHandler = this.throttle(this.rendering.bind(this), Loblurem.DEFAULT_THROTTLE_DELAY);
    this.init();
  }

  get buttons() {
    return this.selector.querySelectorAll("[data-loblurem-btn]");
  }

  get getDisplay() {
    return this.selector.getAttribute("data-loblurem-display");
  }

  // Get option settings
  get options() {
    const attributes = this.selector.getAttribute("data-loblurem").split("/");
    const parseInteger = (value, defaultValue) => Number.isInteger(parseInt(value)) ? parseInt(value) : defaultValue;

    return {
      counts: parseInteger(attributes[0], attributes[0].length),
      contents: !Number.isInteger(parseInt(attributes[0])) ? attributes[0].split('') : [],
      fontSize: parseInteger(attributes[1], 0),
      lineHeight: parseInteger(attributes[2], 0),
      color: attributes[3],
      letterSpacing: parseInteger(attributes[4], 0),
      blur: parseInteger(attributes[5], Loblurem.DEFAULT_BLUR),
    };
  }

  get svgWidth() {
    return this.selector.offsetWidth || this.selector.parentElement.offsetWidth;
  }

  get charsPerRow() {
    return Math.floor(this.svgWidth / (this.options.fontSize + this.options.letterSpacing)) - 1;
  }

  get lineHeight() {
    return this.options.fontSize + this.options.lineHeight;
  }

  // Shuffle the array
  shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  // Generate the number of words in the sentence
  generateCounts(counts) {
    const charsPerSentence = [...this.charsPerSentence];
    let perSentenceChars = [];

    while (counts > 0) {
      charsPerSentence.reduce((p, c, _, a) => {
        if (p <= 0) a.splice(0);
        perSentenceChars.push(c);
        counts = p - c;
        return counts;
      }, counts);
    }

    perSentenceChars.sort((a, b) => b - a);

    while (counts < 0) {
      for (let i = 0; i < perSentenceChars.length; i++) {
        perSentenceChars[i] -= 1;
        counts += 1;
        if (counts >= 0) break;
      }
    }

    return perSentenceChars;
  }

  // Sort the text
  sortText() {
    let charsPerSentence = this.shuffleArray(this.generateCounts(this.options.counts));
    let marks = this.shuffleArray(this.marks);
    let contents = [...this.options.contents];

    charsPerSentence = contents.length ? charsPerSentence.map(c => contents.splice(0, c)) : charsPerSentence.map(c => this.shuffleArray(this.wordsSample).slice(0, c));

    if (!this.options.contents.length) {
      charsPerSentence.map((c, i, a) => {
        c.splice(-1, 1, marks[Math.floor(Math.random() * marks.length)]);
        if (i === a.length - 1) c.splice(-1, 1, this.comma);
      });
    }

    charsPerSentence = charsPerSentence.flat();
    this.selector.setAttribute("data-loblurem", `${charsPerSentence.join('')}/${this.options.fontSize}/${this.options.lineHeight}/${this.options.color}/${this.options.letterSpacing}/${this.options.blur}`);
    charsPerSentence = charsPerSentence.map((_, i, a) => a.slice(i * this.charsPerRow, i * this.charsPerRow + this.charsPerRow)).filter(c => c.length);

    return charsPerSentence;
  }

  generateSVGContent() {
    let rowsTemplate = '';
    let offsetX = this.getOffsetX();
    let rows = this.sortText();
    let svgHeight = this.lineHeight * rows.length;

    rows.forEach((c, i, a) => {
      if (i === a.length - 1) {
        rowsTemplate += `
        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow${this.id})" font-size="${this.options.fontSize}px" x="${offsetX}px" y="${this.lineHeight * (i + 1) - 2}px" letter-spacing="${this.options.letterSpacing}px" font-size="${this.options.fontSize}px" fill="${this.options.color}">${c.join('')}</text>
        `;
      } else {
        rowsTemplate += `
        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow${this.id})" font-size="${this.options.fontSize}px" x="${offsetX}px" y="${this.lineHeight * (i + 1) - 2}px" letter-spacing="${this.options.letterSpacing}px" textLength="${this.svgWidth}" font-size="${this.options.fontSize}px" fill="${this.options.color}">${c.join('')}</text>
        `;
      }
    });

    return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${this.svgWidth}px" height="${svgHeight + 7}px" display="block">
      <filter id="drop-shadow${this.id}"><feGaussianBlur stdDeviation="${this.options.blur}"></feGaussianBlur></filter>
        ${rowsTemplate}
    </svg>
    `;
  }

  getOffsetX() {
    let offsetX;

    switch (this.getDisplay) {
      case "middle":
        offsetX = this.calculateMiddleOffsetX();
        break;
      case "right":
        offsetX = this.calculateRightOffsetX();
        break;
      default:
        offsetX = Loblurem.DEFAULT_OFFSET_X;
    }

    return offsetX;
  }
  calculateMiddleOffsetX() {
    return this.svgWidth / 2 - (this.options.fontSize * this.options.counts + this.options.letterSpacing * (this.options.counts - 1)) / 2;
  }

  calculateRightOffsetX() {
    return this.svgWidth - (this.options.fontSize * this.options.counts + this.options.letterSpacing * (this.options.counts - 1)) - 3;
  }
  centreBtn() {
    if (!this.buttons.length) return;

    this.selector.style.position = "relative";
    let svgHeight = this.lineHeight * this.sortText().length;
    let offsetTop = this.selector.offsetHeight - svgHeight;
    let offsetHeight = [...this.buttons].map(c => c.offsetHeight);
    let iterateOffsetHeight = offsetHeight.reduce((p, c) => {
      if (!p.length) p.push(c);
      let next = p[p.length - 1];
      p.push(next + c);
      return p;
    }, [0]);

    this.buttons.forEach((c, i) => {
      Object.assign(c.style, { top: offsetTop + (svgHeight - this.buttons[0].offsetHeight) / 2 + iterateOffsetHeight[i] + "px", position: "absolute", left: "50%", transform: "translate(-50%, 0)", zIndex: 1, margin: 0 });
    });
  }

  throttle(fn, delay = Loblurem.DEFAULT_THROTTLE_DELAY) {
    let timer = 0;

    return () => {
      const now = Date.now();

      if (now - timer >= delay) {
        fn.call(this);
        timer = now;
      }
    };
  }
  //Initialization
  init() {
    this.selector.style.userSelect = this.selector.style.MozUserSelect = this.selector.style.WebkitUserSelect = this.selector.style.MsUserSelect = "none";

    this.rendering();
    this.resize();
  }
  // draw content
  rendering() {
    this.selector.innerHTML += this.generateSVGContent();
    this.centreBtn();
  }

  // Window size change detection
  resize() {
    const handleWindowEvent = () => {
      if (this.selector.lastElementChild) {
        this.selector.lastElementChild.remove();
        this.selector.innerHTML += this.generateSVGContent();
        this.centreBtn();
      }
    };

    window.addEventListener("resize", this.throttle(handleWindowEvent));
    window.addEventListener("scroll", this.throttle(handleWindowEvent));
  }
}

window.addEventListener("DOMContentLoaded", function () {
  let selectors = document.querySelectorAll("[data-loblurem]");
  selectors.forEach(selector => new Loblurem(selector));
});

window.Loblurem = Loblurem;