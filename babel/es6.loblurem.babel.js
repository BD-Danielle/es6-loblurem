'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var self_lorem = void 0;

var Loblurem = function () {
  // constructor

  // Words list
  function Loblurem(selector) {
    _classCallCheck(this, Loblurem);

    this.charsPerSentence = [7, 8, 9, 10, 11, 12, 13];
    this.wordsSample = ['心', '戶', '手', '文', '斗', '斤', '方', '日', '月', '木', //4
    '令', '北', '本', '以', '主', '充', '半', '失', '巧', '平', //5
    '在', '回', '休', '交', '至', '再', '光', '先', '全', '共', //6
    '邱', '附', '怖', '長', '使', '其', '非', '並', '刻', '取', //8
    '既', '洋', '拜', '面', '促', '前', '飛', '亮', '信', '香', //9
    '班', '借', '家', '勉', '冠', '英', '苦', '為', '段', '派', //10
    '荷', '推', '區', '停', '假', '動', '健', '夠', '問', '將', //11
    '傻', '勢', '亂', '傷', '圓', '傲', '照', '滄', '溺', '準', //13
    '境', '厭', '像', '夢', '奪', '摘', '實', '寧', '管', '種', //14
    '褪', '選', '隨', '憑', '導', '憾', '奮', '擋', '曉', '暸', //16
    '懷', '穩', '曠', '邊', '難', '願', '關', '壞', '爆', '攏' //19
    ];
    this.marks = ["，", "？", "！", "、", "。"];
    this.comma = "。";
    this.id = Math.random().toString(16).slice(2);

    self_lorem = this;
    this.selector = selector;
    this.rendering();
  }
  // Punches list

  // **********Static variables********** //


  _createClass(Loblurem, [{
    key: 'randomizeNum',
    value: function randomizeNum(a, z) {
      return Math.floor(Math.random() * (z - a + 1)) + a;
    }
  }, {
    key: 'shuffleArr',
    value: function shuffleArr(arr) {
      return arr.sort(function () {
        return Math.random() - 0.5;
      });
    }
  }, {
    key: 'glueArr',
    value: function glueArr() {
      var counts = this.options.counts;
      var charsPerSentence = Object.assign([], this.charsPerSentence);
      var charsPerSentence_ = [];
      while (counts > 0) {
        charsPerSentence.reduce(function (p, c, i, a) {
          if (p <= 0) a.splice(0); // eject early
          charsPerSentence_.push(c);
          counts = p - c;
          return counts;
        }, counts);
      }
      charsPerSentence_.sort(function (a, z) {
        return z - a;
      }); // z to a
      while (counts < 0) {
        for (var i = 0; i < charsPerSentence_.length; i++) {
          charsPerSentence_[i] -= 1;
          counts += 1;
          if (counts >= 0) break;
        }
      }
      return charsPerSentence_; // [12, 12, 12, 12, 11, 11, 10, 10, 9, 9, 8, 8, 7, 7, 7]
    }
  }, {
    key: 'sortArrText',
    value: function sortArrText() {
      var _this = this;

      var charsPerSentence = this.shuffleArr(this.glueArr());
      var marks = this.shuffleArr(this.marks);
      var contents = Object.assign([], this.options.contents);
      charsPerSentence = contents.length ? charsPerSentence.map(function (c) {
        return contents.splice(0, c);
      }) : charsPerSentence.map(function (c) {
        return _this.shuffleArr(_this.wordsSample).slice(0, c);
      });
      if (!this.options.contents.length) {
        charsPerSentence.map(function (c, i, a) {
          c.splice(-1, 1, marks[Math.floor(Math.random() * marks.length)]);
          if (i == a.length - 1) c.splice(-1, 1, _this.comma);
        });
      };
      charsPerSentence = charsPerSentence.flat();
      this.selector.setAttribute("data-loblurem", charsPerSentence.join("") + '/' + this.options.fontSize + '/' + this.options.lineHeight + '/' + this.options.color + '/' + this.options.letterSpacing + '/' + this.options.blur);
      charsPerSentence = charsPerSentence.map(function (c, i, a) {
        return a.slice(i * _this.charsPerRow, i * _this.charsPerRow + _this.charsPerRow);
      }).filter(function (c) {
        return c.length;
      });
      return charsPerSentence;
    }
  }, {
    key: 'generateStr',
    value: function generateStr() {
      var _this2 = this;

      var rowsTemplate = "";
      var offsetX = this.getOffsetX();
      var rows = this.sortArrText();
      var svgHeight = this.lineHeight * rows.length;
      // <text kerning="auto" font-family="Microsoft JhengHei" font-size="${this.options.fontSize}px" x="${offsetX}px" y="${this.lineHeight*(i+1) - 2}px" letter-spacing="${this.options.letterSpacing}px" font-size="${this.options.fontSize}px" fill="${this.options.color}">${c.join("")}</text>
      rows.forEach(function (c, i, a) {
        if (i == a.length - 1) {
          rowsTemplate += '\n        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow' + _this2.id + ')" font-size="' + _this2.options.fontSize + 'px" x="' + offsetX + 'px" y="' + (_this2.lineHeight * (i + 1) - 2) + 'px" letter-spacing="' + _this2.options.letterSpacing + 'px" font-size="' + _this2.options.fontSize + 'px" fill="' + _this2.options.color + '">' + c.join("") + '</text>\n        ';
        } else {
          rowsTemplate += '\n        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow' + _this2.id + ')" font-size="' + _this2.options.fontSize + 'px" x="' + offsetX + 'px" y="' + (_this2.lineHeight * (i + 1) - 2) + 'px" letter-spacing="' + _this2.options.letterSpacing + 'px" textLength="' + _this2.svgWidth + '" font-size="' + _this2.options.fontSize + 'px" fill="' + _this2.options.color + '">' + c.join("") + '</text>\n        ';
        }
      });
      return '\n    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + this.svgWidth + 'px" height="' + (svgHeight + 7) + 'px" display="block">\n      <filter id="drop-shadow' + this.id + '"><feGaussianBlur stdDeviation="' + this.options.blur + '"></feGaussianBlur></filter>\n        ' + rowsTemplate + '\n    </svg>\n    ';
    }
  }, {
    key: 'getOffsetX',
    value: function getOffsetX() {
      var offsetX = void 0;
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
  }, {
    key: 'centreBtn',
    value: function centreBtn() {
      if (!this.buttons.length) return;
      this.selector.style.position = "relative";
      var svgHeight = this.lineHeight * this.sortArrText().length;
      var offsetTop = this.selector.offsetHeight - svgHeight; //660
      var offsetHeight = [].concat(_toConsumableArray(this.buttons)).map(function (c) {
        return c.offsetHeight;
      });
      var iterateOffsetHeight = offsetHeight.reduce(function (p, c) {
        if (!p.length) p.push(c);
        var next = p[p.length - 1];
        p.push(next + c);
        return p;
      }, [0]);
      // console.log('iterateOffsetHeight: ', iterateOffsetHeight);//[0, 55, 84, 113, 142] iphone12 pro
      var baseline = offsetTop + (svgHeight - this.buttons[0].offsetHeight) / 2;
      this.buttons.forEach(function (c, i) {
        c.style.top = baseline + iterateOffsetHeight[i] + "px";
        c.style.position = "absolute";
        c.style.left = "50%";
        c.style.transform = "translate(-50%, 0)";
        c.style.zIndex = 1;
        c.style.margin = 0;
      });
    }
  }, {
    key: 'rendering',
    value: function rendering() {
      this.selector.style.userSelect = "none";
      this.selector.style.MozUserSelect = "none";
      this.selector.style.WebkitUserSelect = "none";
      this.selector.style.MsUserSelect = "none";
      this.selector.innerHTML += this.generateStr();
      this.centreBtn();
    }
  }, {
    key: 'buttons',
    get: function get() {
      return this.selector.querySelectorAll("[data-loblurem-btn]");
    }
  }, {
    key: 'getDisplay',
    get: function get() {
      return this.selector.getAttribute("data-loblurem-display");
    }
  }, {
    key: 'options',
    get: function get() {
      var attributes = this.selector.getAttribute("data-loblurem").split("/");
      return {
        counts: Number.isInteger(parseInt(attributes[0])) ? parseInt(attributes[0]) : attributes[0].length, // Number
        contents: !Number.isInteger(parseInt(attributes[0])) ? attributes[0].split("") : [],
        fontSize: parseInt(attributes[1]), // Number
        lineHeight: parseInt(attributes[2]), // Number
        color: attributes[3], // String
        letterSpacing: parseInt(attributes[4]), // Number
        blur: parseInt(typeof attributes[5] == "undefined" ? 4 : attributes[5]) // Number
      };
    }
  }, {
    key: 'svgWidth',
    get: function get() {
      return this.selector.offsetWidth || this.selector.parentElement.offsetWidth;
    }
  }, {
    key: 'charsPerRow',
    get: function get() {
      return Math.floor(this.svgWidth / (this.options.fontSize + this.options.letterSpacing)) - 1;
    }
  }, {
    key: 'lineHeight',
    get: function get() {
      return this.options.fontSize + this.options.lineHeight;
    }
  }]);

  return Loblurem;
}();

;
window.addEventListener("DOMContentLoaded", function () {
  var selectors = document.querySelectorAll("[data-loblurem]");
  selectors.forEach(function (c) {
    return new Loblurem(c);
  });
  window.addEventListener("resize", function () {
    selectors.forEach(function (c) {
      c.lastElementChild.remove();
      new Loblurem(c);
    });
  });
});
