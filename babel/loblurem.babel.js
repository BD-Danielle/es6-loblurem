'use strict';

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
var Loblurem = void 0;
(function ($, window, document, undefined) {

  //Create a class named Loblurem and constructor
  Loblurem = function Loblurem() {
    //Default values.
    // this.type = null;
    this.query = null;
    this.data = null;
  };
  //Static letiables
  Loblurem.COMMA;
  Loblurem.TEXT = 2;
  Loblurem.TEXT_TYPE = {
    PARAGRAPH: 1,
    SENTENCE: 2,
    WORD: 3
    //Words to create blurry text.
  };Loblurem.WORDS = ['心', '戶', '手', '文', '斗', '斤', '方', '日', '月', '木', //4
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

  Loblurem.PUNCH = ["，", "。", "？", "！"];
  Loblurem.WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  // Random integer method.
  Loblurem.prototype.randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Shuffle array without duplicate elements
  Loblurem.prototype.shuffle = function (arr) {
    for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) {}
    return arr;
  };
  // Random sentence length.
  Loblurem.prototype.randomSentenLength = function (range, wordsArray, comma) {
    var count = wordsArray.length;
    // console.log('before ' + count);
    var rangeArray = new Array();
    var mod = void 0;
    range = this.shuffle(Array.apply(null, Array(range[range.length - 1] - range[0] + 1)).map(function (_, i) {
      return i + range[0];
    }));
    // console.log(range);
    while (count > 0) {
      range.reduce(function (accumulator, currentValue, currentIndex, array) {
        if (accumulator <= 0) {
          array.splice(0); // eject early
          return;
        } else {
          rangeArray.push(currentValue);
          count = accumulator - currentValue;
          mod = accumulator;
          return count;
        }
      }, count);
    }
    // console.log('after ' + count);

    rangeArray.splice(rangeArray.length - 1, 1, mod); // [12, 11, 10, 9, 8, 7, 6, 12, 11, 10, 4]
    // console.log('before ' + rangeArray);
    rangeArray = this.customSplice(rangeArray, 7);
    rangeArray = this.shuffle(rangeArray);
    // console.log('after ' + rangeArray);
    if (comma == false) return;

    rangeArray.reduce(function (accumulator, currentValue, currentIndex, array) {
      var target_index = accumulator + currentValue >= wordsArray.length ? wordsArray.length - 1 : accumulator + currentValue;
      wordsArray.splice(target_index, 1, currentIndex + 1 > Loblurem.PUNCH.length ? Loblurem.PUNCH[currentIndex % Loblurem.PUNCH.length] : Loblurem.PUNCH[currentIndex]);
      // console.log(accumulator);
      return accumulator + currentValue;
    }, 0);
  };
  Loblurem.prototype.customSplice = function (ary, min) {
    var less = ary.filter(function (i) {
      return i < min;
    });
    var keep = ary.filter(function (i) {
      return i >= min;
    });
    less.map(function (i) {
      var idx = keep.indexOf(Math.min.apply(null, keep));
      keep[idx] += i;
    });
    return keep;
  };
  // Template literals embedded.
  Loblurem.prototype.template = function (rows, svgWidth, svgHeight, fontSize, fontColor, letterSpacing, stdDeviation, idNO) {
    var flag_one = '';
    var flag_two = '';
    for (var i = 0; i < rows.length; i++) {
      if (i < rows.length - 1) {
        flag_one += '\n        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow' + idNO + ')" font-size="' + fontSize + 'px" x="3px" y="' + (parseInt(svgHeight / rows.length) * (i + 1) - 2) + 'px" letter-spacing="' + letterSpacing + 'px" textLength="' + (svgWidth - 10) + '" font-size="' + fontSize + 'px" filter="url(#drop-shadow)" fill="' + fontColor + '">' + rows[i] + '</text>\n        ';
      } else {
        flag_two = '\n        <text kerning="auto" font-family="Microsoft JhengHei" filter="url(#drop-shadow' + idNO + ')" font-size="' + fontSize + 'px" x="3px" y="' + (parseInt(svgHeight / rows.length) * (i + 1) - 2) + 'px" letter-spacing="' + letterSpacing + 'px" font-size="' + fontSize + 'px" filter="url(#drop-shadow)" fill="' + fontColor + '">' + rows[i] + '</text>\n        ';
      }
    }
    return '\n    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + svgWidth + 'px" height="' + (svgHeight + 7) + 'px" display="block">\n      <filter id="drop-shadow' + idNO + '"><feGaussianBlur stdDeviation="' + (typeof stdDeviation == "undefined" ? stdDeviation = 4 : stdDeviation) + '" result="drop-shadow"></feGaussianBlur></filter>\n        ' + flag_one + flag_two + '\n    </svg>\n    ';
  };
  // Inset punch symbol into text array
  Loblurem.prototype.insert = function (array, index, punch) {
    array.splice(index, 1, punch); // replace A to B at specified index
  };
  // Text creator method with parameters: how many, what
  Loblurem.prototype.createText = function (count, type, svgWidth, idNO, element) {
    var options = this.query.split('/'); // turn to array
    var fontSize = parseInt(options[1], 10);
    var letterSpacing = parseInt(options[4], 10);
    var fontColor = options[3];
    var stdDeviation = options[5];
    // console.log(stdDeviation);
    switch (type) {
      //paragraphs are loads of sentences.
      case Loblurem.TEXT_TYPE.PARAGRAPH:
        var paragraphs = new Array();
        for (var i = 0; i < count; i++) {
          var paragraphLength = this.randomInt(10, 20);
          var paragraph = this.createText(paragraphLength, Loblurem.TEXT_TYPE.SENTENCE, svgWidth, element);
          paragraphs.push('<p>' + paragraph + '</p>');
          console.log(paragraph);
        }
        return paragraphs.join('');
      //sentences are loads of words.
      case Loblurem.TEXT_TYPE.SENTENCE:
        var sentences = new Array();
        for (var _i = 0; _i < count; _i++) {
          var sentenceLength = this.randomInt(5, 10);
          var words = this.createText(sentenceLength, Loblurem.TEXT_TYPE.WORD, svgWidth, element);
          var sentence = words;
          sentences.push(sentence);
        }
        return sentences.join('');
      //words are words
      case Loblurem.TEXT_TYPE.WORD:
        var strings = void 0;
        if (element.hasAttribute('data-loblurem-plaintext') && element.getAttribute('data-loblurem-plaintext').length > 0) {
          strings = element.getAttribute('data-loblurem-plaintext');
        } else {
          var newLoblurem = new Array();
          if (count > Loblurem.WORDS.length) {
            var times = Math.ceil(count / Loblurem.WORDS.length);
            while (times > 0) {
              newLoblurem = this.shuffle(newLoblurem.concat(Loblurem.WORDS));
              times--;
            }
          } else {
            newLoblurem = Loblurem.WORDS;
          }
          // Choose random words from words array
          var wordIndex = this.randomInt(0, newLoblurem.length - count - 1);
          // Turn array to string
          var wordsArray = this.shuffle(newLoblurem).slice(wordIndex, wordIndex + count);
          this.randomSentenLength([7, 13], wordsArray, Loblurem.COMMA);
          strings = wordsArray.join('');
          element.setAttribute("data-loblurem-plaintext", strings);
        }
        var rows = new Array();
        var maxWordsInRow = Math.floor(svgWidth / (fontSize + letterSpacing)) - 1;

        if (maxWordsInRow > 0) {
          while (strings.length > 0) {
            rows.push(strings.slice(0, maxWordsInRow));
            strings = strings.replace(strings.substr(0, maxWordsInRow), '');
          };
        } else {
          element.innerHTML = '你沒有給寬度哦!!!';
          // break;
          return false;
        };
        var lineSpacing = parseInt(options[2], 10); //行距
        var svgHeight = fontSize * rows.length + lineSpacing * (rows.length == 1 ? 1 : rows.length - 1);
        var result = this.template(rows, svgWidth, svgHeight, fontSize, fontColor, letterSpacing, stdDeviation, idNO);
        return result;
    }
  };
  Loblurem.prototype.detectBtn = function (element) {
    var btn = $(element).find('[data-loblurem-btn]');
    if (btn.length > 0) {
      (function () {
        var btnArray = [0, 0];
        for (var i = 0; i < btn.length; i++) {
          $(btn[i]).css('position', 'absolute');
          // btnArray.push($(btn[i]).height());
          btnArray[i] = $(btn[i]).height();
        }

        var eleHeight = $(element).height();

        var _loop = function _loop(_i2) {
          var top = void 0,
              btn0 = btnArray[0],
              btn1 = btnArray[1];
          var styles = {
            top: function (_top) {
              function top() {
                return _top.apply(this, arguments);
              }

              top.toString = function () {
                return _top.toString();
              };

              return top;
            }(function () {
              if (_i2 == 0) {
                top = eleHeight - $(element).find('svg').height() / 2 - btn0 / 2 + 'px';
              }
              if (_i2 == 1) {
                top = eleHeight - $(element).find('svg').height() / 2 + btn0 / 2 + 'px';
              }
              return top;
            }),
            left: '50%',
            transform: 'translate(-50%, 0)',
            'z-index': 1,
            'margin': 0
          };
          $(btn[_i2]).css(styles);
        };

        for (var _i2 = 0; _i2 < btn.length; _i2++) {
          _loop(_i2);
        }
        $(element).css('position', 'relative');
      })();
    }
    return;
  };
  Loblurem.prototype.copyForbidden = function (element) {
    var css = {
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      'user-select': 'none',
      '-ms-user-select': 'none',
      '-khtml-user-select': 'none'
    };
    $(element).find('svg').css(css);
  };
  Loblurem.prototype.createLoblurem = function (element, svgWidth, i) {
    var loblurem = void 0;
    var count = void 0;
    var options = this.query.split('/'); // turn to array
    var words = options[0];
    var type = void 0;
    // console.log(element, "this.query: " + this.query, "this.type: " + this.type);
    if (/\d+-\d+[psw]/.test(words)) {
      var range = words.substring(0, words.length - 1).split("-"); // turn to array
      count = this.randomInt(parseInt(range[0]), parseInt(range[1]));
    } else {
      count = parseInt(words);
    }

    var typeInput = words[words.length - 1]; //fetch last index value
    if (typeInput == 'p') {
      type = Loblurem.TEXT_TYPE.PARAGRAPH;
    } else if (typeInput == 's') {
      type = Loblurem.TEXT_TYPE.SENTENCE;
    } else if (typeInput == 'w') {
      type = Loblurem.TEXT_TYPE.WORD;
      Loblurem.COMMA = true;
    } else if (typeInput == 'W') {
      type = Loblurem.TEXT_TYPE.WORD;
      Loblurem.COMMA = false;
    }

    loblurem = this.createText(count, type, svgWidth, i, element);
    if (element) {
      if (loblurem !== false) {
        element.innerHTML += loblurem;
      }
      this.detectBtn(element);
      this.copyForbidden(element);
    }
    if (element == null) return loblurem;
  };
  window.addEventListener('DOMContentLoaded', function () {
    // Select all elements that has a data-boblurem attribute
    var els = document.querySelectorAll('[data-loblurem]'),
        svgWidth = void 0;
    function forLoops() {
      for (var i in els) {
        if (els.hasOwnProperty(i)) {
          var loblurem = new Loblurem();
          svgWidth = $(els).eq(i).innerWidth() || $(els).eq(i).parent().innerWidth();
          loblurem.query = els[i].getAttribute('data-loblurem');
          if (!els[i].hasAttribute('data-loblurem-plaintext')) {
            els[i].setAttribute('data-loblurem-plaintext', '');
          }
          loblurem.createLoblurem(els[i], svgWidth, i);
        }
      }
    };
    $(window).on('resize orientationchange', function () {
      $(els).find('svg').remove();
      forLoops();
    });
    forLoops();
  });
})(jQuery, window, document);
