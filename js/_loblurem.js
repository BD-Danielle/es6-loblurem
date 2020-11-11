/*
 * Loblurem 1.0
 * Loblurem plugin for generating blurry text
 * click108
 * Copyright 2019, MIT License
 * 使用方式 給予自定義屬性 data-loblurem
 * 使用方式 給予屬性值 "100w(字數)/22(字型大小)/10(行間間距)/#737373(字型顏色)/5(字元間距)/4(模糊程度預設)"
 * 使用方式 如果不需要標點符號，第一個參數請給大寫的[W]
 * 針對模糊程度，允許傳入屬性值，默認值為4，如需調正其值，請在字元間距後加入數值，數值越大，其越模糊，並用斜線劃分
 * 如果模糊段落中，有超連結按鈕，請給於屬性 data-loblurem-btn，屬性值不用給予
 * 使用限制 如果 data-loblurem 是跟著 p tag, 子節點 data-loblurem-btn 就必需是
 * 1. span包a，2.單純a，3.或是轉成箱型屬性標籤
 */
let Loblurem;
(function ($, window, document) {

  // Create a class 
  Loblurem = function () {
    // Default values 
    this.options = null;
    this.hasMark = null;
    this.isSentence = null;
  };

  // Release module to window
  window.Loblurem = Loblurem;

  // **********Static variables********** //
  // Range of words per sentence 
  Loblurem.RANGE_LENGTH = [7, 13];

  // Words list
  Loblurem.WORDS = [
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
  Loblurem.MARKS = ["，", "？", "！", "、", "。"];

  // Random number
  Loblurem.prototype.randomNo = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Return a NodeList(number) that includes a bunch of match collection,
  // can get node values by iteration.
  Loblurem.prototype.element = function (i, children) {
    return typeof children == 'undefined' ? document.querySelectorAll('[data-loblurem]')[i] :
      document.querySelectorAll('[data-loblurem]')[i].querySelectorAll(children);
  }
  Loblurem.prototype.svgWidth = function () {
    return this.element(i).offsetWidth;
  }
  Loblurem.prototype.splitOptions = function (i) {
    this.options = this.element(i).getAttribute('data-loblurem').split('/');
    this.isSentence = this.hasMark = this.options[0][this.options[0].length - 1] == 'w' ? true : false;
    return this.options = {
      'count': parseInt(this.options[0]),
      'fontSize': parseInt(this.options[1]),
      'lineHeight': parseInt(this.options[2]),
      'color': this.options[3],
      'letterSpacing': parseInt(this.options[4]),
      'blur': parseInt(typeof this.options[5] == 'undefined' ? 4 : this.options[5])
    }
  }
  // Return the detailed size of obj
  // Loblurem.prototype.objSize = function(i){
  //   return {
  //    'selfWidth': this.element(i).offsetWidth,
  //   //  'selfHeight': this.options(ele).offsetHeight
  //   }
  // }
  // Shuffle array without duplicate elements
  // Loblurem.prototype.shuffleAry = function (arr) {
  //   for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
  //   return arr;
  // }
  Loblurem.prototype.shuffleAry = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      var j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  // Get the rest number to add to another number
  Loblurem.prototype.spliceRest = function (ary, min) {
    var theRest = ary.filter(function (ele) { return ele < min });
    var theMain = ary.filter(function (ele) { return ele >= min });
    theRest.map(function (ele) {
      // Math.min.apply to get min of an array in JavaScript
      var idx = theMain.indexOf(Math.min.apply(null, theMain));
      theMain[idx] += ele;
    });
    // [9, 10, 12, 13, 11, 8, 7, 9, 10, 12, 13, 11, 8, 7, 9, 8]
    return theMain;
  }
  // Random sentence length.
  Loblurem.prototype.insertMarks = function () {
    var count = this.options.count;
    var mod;
    var rangeAry = [];
    // Array.apply(null, new Array(numerical)), returns with numerical arguments of undefined in list
    // [13, 7, 10, 8, 11, 9, 12]
    var deconstruction = this.shuffleAry(Array.apply(null, Array(Loblurem.RANGE_LENGTH[1] - Loblurem.RANGE_LENGTH[0] + 1)).map(function (_ele, idx) {
      return idx + Loblurem.RANGE_LENGTH[0];
    }));
    while (count > 0) {
      deconstruction.reduce(function (ac, cv, _, array) {
        if (ac <= 0) {
          array.splice(0); // eject early
          return;
        } else {
          rangeAry.push(cv);
          count = ac - cv;
          mod = ac;
          return count;
        }
      }, count);
    }
    // console.log('after ' + count);

    rangeAry.splice(rangeAry.length - 1, 1, mod); // [12, 11, 10, 9, 8, 7, 6, 12, 11, 10, 4]
    rangeAry = this.shuffleAry(this.spliceRest(rangeAry, Loblurem.RANGE_LENGTH[0]));
    if (!this.hasMark) return;
    rangeAry.reduce(function (ac, cv, currentIndex, _array) {
      var target_index = ((ac + cv) >= _array.length) ? _array.length - 1 : (ac + cv);
      _array.splice(target_index, 1, currentIndex + 1 > Loblurem.MARKS.length ? Loblurem.MARKS[currentIndex % Loblurem.MARKS.length] : Loblurem.MARKS[currentIndex]);
      return ac + cv;
    }, 0);
  }

  // Template structure
  Loblurem.prototype.htmlTemplate = function (rows, svgWidth, svgHeight, idNO, offsetX) {
    var theFirstFewRows = theLastRow = '';
    for (var i = 0; i < rows.length; i++) {
      if (i < rows.length - 1) {
        theFirstFewRows += `
        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow${idNO})" font-size="${this.options.fontSize}px" x="${offsetX}px" y="${parseInt(svgHeight / rows.length) * (i + 1) - 2}px" letter-spacing="${this.options.letterSpacing}px" textLength="${this.isSentence ? svgWidth - 10 : 0}" font-size="${this.options.fontSize}px" filter="url(#drop-shadow)" fill="${this.options.color}">${rows[i]}</text>
        `
      } else {
        theLastRow = `
        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow${idNO})" font-size="${this.options.fontSize}px" x="${offsetX}px" y="${parseInt(svgHeight / rows.length) * (i + 1) - 2}px" letter-spacing="${this.options.letterSpacing}px" font-size="${this.options.fontSize}px" filter="url(#drop-shadow)" fill="${this.options.color}">${rows[i]}</text>
        `
      }
    }
    return `
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${svgWidth}px" height="${svgHeight + 7}px" display="block">
      <filter id="drop-shadow${idNO}"><feGaussianBlur stdDeviation="${(typeof this.options.blur == "undefined") ? 4 : this.options.blur}" result="drop-shadow"></feGaussianBlur></filter>
        ${theFirstFewRows}${theLastRow}
    </svg>
    `
  }
  // Inset mark symbol into text array
  // Loblurem.prototype._insertMarks = function (ary, idx, mark) {
  //   // replace A to B at the specified index, 
  //   // 0 means only insert nothing replace,
  //   // >= 1 means how many elements should be replaced.
  //   ary.splice(idx, 1, mark); 
  // };
  // Text creator method with parameters: how many, what
  Loblurem.prototype.generateTEXT = function (svgWidth, i) {
    this.splitOptions(i);
    var strings;
    if (this.element(i).hasAttribute('data-loblurem-plaintext') && this.element(i).getAttribute('data-loblurem-plaintext').length > 0) {
      strings = this.element(i).getAttribute('data-loblurem-plaintext');
    } else {
      var newLoblurem = [];
      // if the count is larger than the total number of words counted that
      // has to multiply 
      if (this.options.count > Loblurem.WORDS.length) {
        var times = Math.ceil(this.options.count / Loblurem.WORDS.length);
        while (times > 0) {
          newLoblurem = this.shuffleAry(newLoblurem.concat(Loblurem.WORDS));
          times--;
        }
      } else {
        newLoblurem = Loblurem.WORDS;
      }
      // Choose random words from words array
      var randomIdx = this.randomNo(0, newLoblurem.length - this.options.count - 1);
      // Turn array to string
      var wordsArray = this.shuffleAry(newLoblurem).slice(randomIdx, randomIdx + this.options.count);
      this.insertMarks();
      strings = wordsArray.join('');
      this.element(i).setAttribute("data-loblurem-plaintext", strings);
    }
    var rows = [];
    var maxWordsInRow = Math.floor(svgWidth / (this.options.fontSize + this.options.letterSpacing)) - 1;
    if (maxWordsInRow > 0) {
      while (strings.length > 0) {
        rows.push(strings.slice(0, maxWordsInRow));
        strings = strings.replace(strings.substr(0, maxWordsInRow), '');
      };
    } else {
      this.element().insertAdjacentHTML('afterend', '<div style="font-weight: bold; font-size: 32px; color: red">小笨笨，你沒有給寬度哦!!!</div>');
      return false;
    };
    var svgHeight = this.options.fontSize * rows.length + this.options.lineHeight * (rows.length == 1 ? 1 : rows.length - 1);
    var offsetX = this.display(svgWidth, i);
    var result = this.htmlTemplate(rows, svgWidth, svgHeight, i, offsetX);
    return result;
  };
  Loblurem.prototype.display = function (svgWidth, i) {
    var display, offsetX;
    if (this.element(i).hasAttribute('data-loblurem-display') && this.element(i).getAttribute('data-loblurem-display').length > 0) {
      display = this.element(i).getAttribute('data-loblurem-display');
      switch (display) {
        case "middle":
          offsetX = svgWidth / 2 - (this.options.fontSize * this.options.count + this.options.letterSpacing * (this.options.count - 1)) / 2;
          break;

        case "right":
          offsetX = svgWidth - (this.options.fontSize * this.options.count + this.options.letterSpacing * (this.options.count - 1)) - 3;
          break;

        default:
          return offsetX = 3;
      }
    } else {
      offsetX = 3;
    }
    return offsetX;
  };
  Loblurem.prototype.centralizeBtn = function (i) {
    var btn = this.element(i, '[data-loblurem-btn]');
    if (!btn) return;
    // If there is no 
    var ele = this.element(i);
    var svg = this.element(i, 'svg');
    for (var j = 0; j < btn.length; j++) {
      var top = j == 0 ? 
      ele.offsetHeight - parseInt(svg[0].getAttribute('height')) / 2  - btn[j].offsetHeight / 2 + 'px' : 
      ele.offsetHeight - parseInt(svg[0].getAttribute('height')) / 2  + btn[j].offsetHeight / 2 + 'px' ;
      console.log(top);
      btn[j].style.position = 'absolute';
      btn[j].style.top = top;
      btn[j].style.left = '50%';
      btn[j].style.transform = 'translate(-50%, 0)';
      btn[j].style.zIndex = 1;
      btn[j].style.margin = 0;
    }
    ele.style.position = 'relative';
  };

  Loblurem.prototype.preventCopy = function (i) {
    this.element(i).style.userSelect = 'none'
  };
  Loblurem.prototype.generateLoblurem = function (svgWidth, i) {
    var loblurem = this.generateTEXT(svgWidth, i);
    if (loblurem == null) return;
    this.element(i).innerHTML += loblurem;
    this.centralizeBtn(i);
    this.preventCopy(i);
  };
  window.addEventListener('DOMContentLoaded', function () {
    // Select all elements that has a data-loblurem attribute
    var query = document.querySelectorAll('[data-loblurem]');
    var length = query.length;
    function render() {
      for (var i = 0; i < length; i++) {
        var loblurem = new Loblurem;
        var ele = loblurem.element(i);
        var svgWidth = ele.offsetWidth || ele.parentElement.offsetWidth;
        if (!ele.hasAttribute('data-loblurem-plaintext')) ele.setAttribute('data-loblurem-plaintext', '');

        loblurem.generateLoblurem(svgWidth, i);
      }
    };
    function reRender() {
      for(var i = 0; i < length; i++){
        query[i].lastElementChild.remove();
      }
      render();
    }
    window.addEventListener('resize', function () { reRender(); })
    window.addEventListener('orientationchange', function () { reRender(); })
    render();
  });
})(jQuery, window, document);