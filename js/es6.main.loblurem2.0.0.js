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
            // 如果 options.contents 有值，直接使用該內容
            if (this.#options.contents.length > 0) {
                const result = [];
                let currentIndex = 0;
                let currentSentence = [];
                
                // 遍歷內容，按原有標點符號分段
                for (const char of this.#options.contents) {
                    currentSentence.push(char);
                    
                    // 如果遇到標點符號，保存當前句子
                    if (this.#marks.includes(char)) {
                        result.push(...currentSentence);
                        currentSentence = [];
                    }
                }
                
                // 处理最后一个句子（如果没有以标点符号结尾）
                if (currentSentence.length > 0) {
                    result.push(...currentSentence);
                }
                
                return result;
            }
            
            // 如果没有预设内容，则生成随机内容
            const shuffled = [...this.#wordsSample].sort(() => Math.random() - 0.5);
            const result = [];
            let currentIndex = 0;
            let previousSentence = null;

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
                    // 取得當前句子的文
                    const sentence = shuffled.slice(currentIndex, currentIndex + remainingCount);
                    
                    // 如果最後區塊字數小於7且有前一個句子，合併到前一個句子
                    if (sentence.length < 7 && result.length > 0) {
                        // 移除前一個句��的標點符號
                        result.pop();
                        result.push(...sentence);
                        // 添加句號結尾
                        result.push('。');
                    } else {
                        result.push(...sentence, '。');
                    }
                    break;
                }

                // 取得當前句子的文字
                const sentence = shuffled.slice(currentIndex, currentIndex + sentenceLength);
                
                // 如果當前句子字數小於7且不是第一個句子，與前一句合併
                if (sentence.length < 7 && result.length > 0) {
                    // 移除前一個句子的標點符號
                    result.pop();
                    result.push(...sentence);
                    // 添加隨機標點符號
                    const randomMark = this.#marks[Math.floor(Math.random() * this.#marks.length)];
                    result.push(randomMark);
                } else {
                    // 正常處理句子
                    const randomMark = this.#marks[Math.floor(Math.random() * this.#marks.length)];
                    result.push(...sentence, randomMark);
                }
                
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

        this.#appendContent = async (svgData, content) => {
            const {svg, filterId} = svgData;
            
            // 計算每行可容納的字符數
            const containerWidth = this.#selector.offsetWidth;
            const charWidth = this.#options.fontSize + this.#options.letterSpacing;
            const charsPerRow = Math.floor((containerWidth - 10) / charWidth);
            
            // 获取对齐方式 - 移到 Promise 外部
            const displayAlign = this.#selector.getAttribute('data-loblurem-display') || 'left';
            
            // 将内容分行
            const lines = [];
            let currentLine = [];
            let currentLength = 0;

            return new Promise((resolve, reject) => {
                try {
                    // 分行處理
                    for (let i = 0; i < content.length; i++) {
                        const char = content[i];
                        
                        // 檢查是否達到行寬限制
                        if (currentLength >= charsPerRow) {
                            lines.push([...currentLine]);
                            currentLine = [];
                            currentLength = 0;
                        }
                        
                        currentLine.push(char);
                        currentLength++;
                    }
                    
                    // 處理最後一行
                    if (currentLine.length > 0) {
                        lines.push(currentLine);
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
                        
                        // 根据对齐方式设置x坐标
                        let x = Loblurem.#DEFAULT_OFFSET_X;
                        switch (displayAlign) {
                            case 'right':
                                // 计算右对齐位置
                                const lineWidth = line.length * (this.#options.fontSize + this.#options.letterSpacing);
                                x = containerWidth - lineWidth - Loblurem.#DEFAULT_OFFSET_X;
                                break;
                            case 'middle':
                                // 计算居中对齐位置
                                const middleWidth = line.length * (this.#options.fontSize + this.#options.letterSpacing);
                                x = (containerWidth - middleWidth) / 2;
                                break;
                            default:
                                // 左對齊，使用默認值
                                break;
                        }
                        
                        text.setAttribute('x', `${x}px`);
                        text.setAttribute('y', `${y}px`);
                        
                        // 只有非最後一行且不含標點符號的行才進行長度調整
                        const isLastLine = index === lines.length - 1;
                        const containsPunctuation = line.some(char => this.#marks.includes(char));
                        
                        if (!isLastLine && !containsPunctuation && displayAlign === 'left') {
                            text.setAttribute('textLength', `${containerWidth - 10}px`);
                            text.setAttribute('lengthAdjust', 'spacing');
                        }
                        
                        text.textContent = line.join('');
                        svg.appendChild(text);
                    });

                    // 確保所有文字元素都已添加到 SVG 中
                    requestAnimationFrame(() => {
                        resolve(svg);
                    });
                } catch (error) {
                    reject(error);
                }
            });
        };

        this.#init = async () => {
            try {
                // 設置選擇器樣式
                this.#selector.style.userSelect = 'none';
                this.#selector.style.MozUserSelect = 'none';
                this.#selector.style.WebkitUserSelect = 'none';
                this.#selector.style.MsUserSelect = 'none';
                
                // 等待字體加載和初始化完成
                await this.#loadFonts();
                await this.#initResizeObserver();
                
                // 執行首次渲染
                await this.#render();
                
                // 觸發準備完成事件
                this.dispatchEvent(new CustomEvent('ready'));
            } catch (error) {
                this.dispatchEvent(new CustomEvent('error', { detail: error }));
                throw error;
            }
        };

        this.#render = async () => {
            try {
                // 如果沒有緩存的內容，生成新的內容
                if (!this.#cachedContent) {
                    this.#cachedContent = this.#generateContent();
                }
                
                // 創建 SVG 元素
                const svgData = this.#createSVGElement();
                
                // 等待字體加載完成
                await this.#loadFonts();
                
                // 渲染內容
                await this.#appendContent(svgData, this.#cachedContent);
                
                // 更新 DOM
                this.#selector.innerHTML = '';
                this.#selector.appendChild(svgData.svg);
                
                // 觸發渲染完成事件
                this.dispatchEvent(new CustomEvent('rendered'));
                
                return svgData.svg;
            } catch (error) {
                this.dispatchEvent(new CustomEvent('error', { detail: error }));
                throw error;
            }
        };

        this.#updateSVG = (contentRect = null) => {
            if (contentRect) {
                this.#selector.style.width = `${contentRect.width}px`;
            }
            this.#render();
        };
        
        // 初始化實例
        this.#validateSelector(selector);
        this.#selector = selector;
        this.#options = this.#parseOptions(options);
        this.#instances.set(selector, this);
        
        // 啟動初化
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
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Loblurem;
    }
    exports.Loblurem = Loblurem;
} else if (typeof define === 'function' && define.amd) {
    define('Loblurem', [], function() {
        return Loblurem;
    });
} else {
    window.Loblurem = Loblurem;
}

// 自動初始化
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', function() {
        const elements = document.querySelectorAll('[data-loblurem]');
        elements.forEach(element => new Loblurem(element));
    });
}