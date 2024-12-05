/*
 * Loblurem 2.0.0
 * 使用 ES2024 特性重構
 */

// 使用私有字段和靜態私有字段
class Loblurem extends EventTarget {
    static #DEFAULT_THROTTLE_DELAY = 250;
    static #DEFAULT_BLUR = 4;
    static #DEFAULT_OFFSET_X = 2.5;
    
    // 聲明所有私有字段
    #selector;
    #options;
    #instances = new WeakMap();
    #resizeObserver;
    #fontRegistry = new Set(['Microsoft JhengHei']);
    #updateSVG;
    #render;
    #init;
    #renderContent;
    #validateSelector;
    #parseOptions;
    #loadFonts;
    #initResizeObserver;
    #handleResize;
    #generateContent;
    #createSVGElement;
    #appendContent;
    #cachedContent = null;
    
    // 使用類字段初始化
    #charsPerSentence = [7, 8, 9, 10, 11, 12, 13];
    #wordsSample = [
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
    #marks = ["，", "？", "！", "、", "。"];
    
    constructor(selector, options = {}) {
        super();
        
        // 初始化所有私有方法
        this.#validateSelector = (selector) => {
            if (!selector?.matches?.('[data-loblurem]')) {
                throw new Error('Invalid selector: Element must have data-loblurem attribute');
            }
        };

        this.#parseOptions = (options) => {
            // 解析 data-loblurem 屬性
            const attributes = this.#selector.getAttribute("data-loblurem").split("/");
            
            return {
                counts: Number.isInteger(parseInt(attributes[0])) ? parseInt(attributes[0]) : attributes[0].length,
                contents: !Number.isInteger(parseInt(attributes[0])) ? attributes[0].split('') : [],
                fontSize: Number.isInteger(parseInt(attributes[1])) ? parseInt(attributes[1]) : 16,
                lineHeight: Number.isInteger(parseInt(attributes[2])) ? parseInt(attributes[2]) : 10,
                color: attributes[3] || '#000',
                letterSpacing: Number.isInteger(parseInt(attributes[4])) ? parseInt(attributes[4]) : 2,
                blur: Number.isInteger(parseInt(attributes[5])) ? parseInt(attributes[5]) : Loblurem.#DEFAULT_BLUR,
            };
        };

        this.#loadFonts = async () => {
            try {
                for (const font of this.#fontRegistry) {
                    await document.fonts.load(`16px "${font}"`);
                }
            } catch (error) {
                this.dispatchEvent(new CustomEvent('error', { detail: error }));
            }
        };

        this.#initResizeObserver = async () => {
            const { promise, resolve } = Promise.withResolvers();
            
            // 使用 ResizeObserver 監聽容器大小變化
            this.#resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    if (entry.target === this.#selector) {
                        this.#handleResize();
                    }
                }
                resolve();
            });
            
            // 同時監聽窗口大小變化
            window.addEventListener('resize', this.#throttle(() => {
                this.#handleResize();
            }, Loblurem.#DEFAULT_THROTTLE_DELAY));
            
            this.#resizeObserver.observe(this.#selector);
            await promise;
        };

        this.#handleResize = () => {
            // 重新渲染整個 SVG
            this.#render();
        };

        this.#generateContent = () => {
            // 隨機打亂字符數組
            const shuffled = [...this.#wordsSample].sort(() => Math.random() - 0.5);
            const result = [];
            let currentIndex = 0;

            // 根據 charsPerSentence 切分文字區塊
            while (currentIndex < this.#options.counts) {
                // 隨機選擇一個句子長度
                const sentenceLength = this.#charsPerSentence[
                    Math.floor(Math.random() * this.#charsPerSentence.length)
                ];

                // 計算剩餘可用字數
                const remainingCount = this.#options.counts - currentIndex;
                
                // 處理最後一個區塊
                if (remainingCount <= sentenceLength) {
                    // 計算需要補充的字數（扣除句號）
                    const neededChars = sentenceLength - remainingCount;
                    
                    // 取得當前句子的文字
                    const sentence = shuffled.slice(currentIndex, currentIndex + remainingCount);
                    
                    // 補充字數
                    if (neededChars > 0) {
                        sentence.push(...shuffled.slice(0, neededChars));
                    }
                    
                    // 添加句號
                    sentence.push('。');
                    result.push(...sentence);
                    break;
                }

                // 取得當前句子的文字
                const sentence = shuffled.slice(currentIndex, currentIndex + sentenceLength);
                
                // 添加標點符號（逗號或頓號）
                sentence.push(Math.random() < 0.5 ? '，' : '、');
                
                // 將句子加入結果
                result.push(...sentence);
                currentIndex += sentenceLength;
            }

            return result;
        };

        this.#createSVGElement = () => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            
            const filterId = `drop-shadow-${Math.random().toString(16).slice(2)}`;
            filter.setAttribute('id', filterId);
            
            const gaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            gaussianBlur.setAttribute('stdDeviation', this.#options.blur);
            filter.appendChild(gaussianBlur);
            
            defs.appendChild(filter);
            svg.appendChild(defs);
            
            // 計算容器寬度和每行字符數
            const containerWidth = this.#selector.getBoundingClientRect().width;
            const charWidth = this.#options.fontSize + this.#options.letterSpacing;
            const charsPerRow = Math.floor((containerWidth - 10) / charWidth);
            
            // 計算實際行數
            const totalLines = Math.ceil(this.#cachedContent.length / charsPerRow);
            
            // 算度（添加適當的邊距）
            const lineHeight = this.#options.fontSize + this.#options.lineHeight;
            const totalHeight = (lineHeight * totalLines) + (this.#options.lineHeight * 0.5);
            
            // 設置 SVG 屬性
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', `${totalHeight}px`);
            svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
            svg.setAttribute('viewBox', `0 0 ${containerWidth} ${totalHeight}`);
            
            return {svg, filterId, containerWidth};
        };

        this.#appendContent = (svgData, content) => {
            const {svg, filterId} = svgData;
            
            // 計算每行可容納的字符數
            const containerWidth = this.#selector.offsetWidth;
            const charWidth = this.#options.fontSize + this.#options.letterSpacing;
            const charsPerRow = Math.floor((containerWidth - 10) / charWidth);
            
            // 將內容分行
            const lines = [];
            for (let i = 0; i < content.length; i += charsPerRow) {
                lines.push(content.slice(i, i + charsPerRow));
            }
            
            // 為每一行創建文字元素
            lines.forEach((line, index) => {
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                
                // 基本屬性設置
                text.setAttribute('kerning', 'auto');
                text.setAttribute('font-family', 'Microsoft JhengHei');
                text.setAttribute('filter', `url(#${filterId})`);
                text.setAttribute('font-size', `${this.#options.fontSize}px`);
                text.setAttribute('letter-spacing', `${this.#options.letterSpacing}px`);
                text.setAttribute('fill', this.#options.color);
                
                // 計算Y軸位置
                const y = (this.#options.fontSize + this.#options.lineHeight) * (index + 1) - 2;
                text.setAttribute('x', `${Loblurem.#DEFAULT_OFFSET_X}px`);
                text.setAttribute('y', `${y}px`);
                
                // 設置文字長度和對齊
                const isLastLine = index === lines.length - 1;
                if (!isLastLine) {
                    text.setAttribute('textLength', `${containerWidth - 10}px`);
                    text.setAttribute('lengthAdjust', 'spacing');
                }
                
                text.textContent = line.join('');
                svg.appendChild(text);
            });
        };

        this.#init = async () => {
            try {
                await this.#loadFonts();
                await this.#renderContent();
                this.dispatchEvent(new CustomEvent('ready'));
            } catch (error) {
                this.dispatchEvent(new CustomEvent('error', { detail: error }));
            }
        };

        this.#render = () => {
            // 如果沒有緩存的內容，生成新的內容
            if (!this.#cachedContent) {
                this.#cachedContent = this.#generateContent();
            }
            
            // 清除舊的內容
            const svgData = this.#createSVGElement();
            this.#appendContent(svgData, this.#cachedContent);
            
            // 更新 DOM
            this.#selector.innerHTML = '';
            this.#selector.appendChild(svgData.svg);
        };

        this.#updateSVG = (contentRect = null) => {
            if (contentRect) {
                this.#selector.style.width = `${contentRect.width}px`;
            }
            this.#render();
        };
        
        this.#renderContent = async () => {
            await this.#render();
            this.dispatchEvent(new CustomEvent('rendered'));
        };
        
        // 初始化實例
        this.#validateSelector(selector);
        this.#selector = selector;
        this.#options = this.#parseOptions(options);
        this.#instances.set(selector, this);
        
        // 啟動初始化
        this.#initResizeObserver();
        this.#init();
    }

    // 輔助方法
    #throttle(fn, delay) {
        let lastTime = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                return fn.apply(this, args);
            }
        };
    }

    // 公共 API 方法
    addFont(fontFamily) {
        this.#fontRegistry.add(fontFamily);
        return this;
    }

    setOptions(newOptions) {
        this.#options = {...this.#options, ...newOptions};
        this.#updateSVG();
        return this;
    }

    destroy() {
        this.#resizeObserver?.disconnect();
        this.#instances.delete(this.#selector);
        this.#selector.innerHTML = '';
        this.dispatchEvent(new CustomEvent('destroy'));
    }

    resetContent() {
        this.#cachedContent = null;
        this.#render();
        return this;
    }
}

// 修改導出部分
(function(global) {
    if (typeof module !== 'undefined' && module.exports) {
        // CommonJS 導出
        module.exports = Loblurem;
    } else if (typeof define === 'function' && define.amd) {
        // AMD 導出
        define([], function() {
            return Loblurem;
        });
    } else {
        // 瀏覽器全局導出
        global.Loblurem = Loblurem;
        
        // 自動初始化所有 Loblurem 實例
        global.addEventListener("DOMContentLoaded", function () {
            const selectors = document.querySelectorAll("[data-loblurem]");
            selectors.forEach(selector => new Loblurem(selector));
        });
    }
})(typeof window !== 'undefined' ? window : this);