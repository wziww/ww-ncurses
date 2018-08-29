const ncurses = require('../build/Release/ncurses.node');
/**
 * win 基类
 */
class winBase {
    constructor({
        width = 0,
        height = 0,
        y = 0,
        x = 0,
        title = null,
        innerColor = 0,
        innerIndex = null,
        ScrollBar = true
    } = {}) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.title = title;
        this._win = new ncurses.Win(width, height, y, x);
        this._inner = [];
        this._innerIndex = innerIndex === 0 ? 0 : (innerIndex || -1);
        this._actIndex = this._innerIndex;
        this._innerColor = innerColor;
        this._ScrollBar = ScrollBar;
        return this;
    }
    unSelect() {
        ncurses.use_default_colors();
        this.Box();
        return this;
    }
    inner(array) {
        if (!(array instanceof Array)) {
            if (typeof array === 'object') {
                array = [array];
            } else {
                array = ['' + array];
            }
        }
        this._inner = array;
        return this;
    }
    selected({
        color = 0
    } = {}) {
        this._win.Wattron(Number(color));
        this.Box();
        this._win.Wattroff(Number(color));
        return this;
    }
    Box() {
        this._win.Box();
        if (this.title) {
            this._win.Mvwprintw(0, 3, ' ' + this.title + ' ');
        }
        this._win.Wrefresh();
        return this;
    }
    draw() {
        const length = (this._inner.length > (this.height - 2)) ? this.height - 2 : this._inner.length;
        const diff = this._actIndex - this._innerIndex;
        if (this._ScrollBar) {
            this.ScrollBar();
        }
        for (let i = diff; i < length + diff; i++) {
            if (i === (this._innerIndex + diff)) {
                this._win.Wattron(Number(this._innerColor));
            }
            const str = `${this._inner[i].index?i + 1 +'.  ':''}${this._inner[i].value}`;
            this._win.Mvwprintw(1 + i - diff, 1, str);
            if (i === (this._innerIndex + diff)) {
                this._win.Wattroff(Number(this._innerColor));
            }
        }
        this._win.Wrefresh();
        return this;
    }
    // 滚动条
    ScrollBar() {
        const length = (this._inner.length > (this.height - 2)) ? this.height - 2 : this._inner.length;
        const WHITE_FILL = 1024;
        ncurses.init_pair(WHITE_FILL, ncurses.COLOR_WHITE, ncurses.COLOR_WHITE);
        for (let i = 0; i < length; i++) { // clear ScroolBar
            this._win.Mvwprintw(1 + i, this.width - 2, ' ');
        }
        const BAR_LENGTH = parseInt((length / this._inner.length * (this.height - 2)));
        const OFFSET = parseInt(this.height - 2 - BAR_LENGTH);
        const LEFT_TOTAL = this._inner.length - this.height + 2;
        const diff = this._actIndex - this._innerIndex;
        for (let i = 0; i < BAR_LENGTH; i++) {
            this._win.Wattron(WHITE_FILL);
            const str = ` `;
            this._win.Mvwprintw(1 + i + diff / LEFT_TOTAL * OFFSET, this.width - 2, str);
            this._win.Wattroff(WHITE_FILL);
        }
    }
}
/**
 * win 类管理类
 */
class cluster {
    constructor(winBaseArray, config = {}) {
        if (!(winBaseArray instanceof Array)) throw Error(`cluster init Error`);
        if (!winBaseArray.length) throw Error(`cluster init Error`);
        for (let i = 0; i < winBaseArray.length; i++) {
            if (!(winBaseArray[i] instanceof winBase)) throw Error(`cluster init Error`);
        }
        this._config = config;
        this._index = config.index || 0;
        this._winBaseArray = winBaseArray;
        this._currentWinBase = winBaseArray[0];
        return this;
    }
    /**
     * 节点向后选择
     * @param {} 
     */
    next(bool) {
        this._index = this._index === (this._winBaseArray.length - 1) ? 0 : (this._index + 1);
        this._currentWinBase = this._winBaseArray[this._index];
        if (bool) this._unSelected();
        this._selected();
        return this;
    }
    /**
     * 节点向前选择
     */
    prev(bool) {
        this._index = this._index === 0 ? (this._winBaseArray.length - 1) : (this._index - 1);
        this._currentWinBase = this._winBaseArray[this._index];
        if (bool) this._unSelected();
        this._selected();
        return this;
    }
    up() {
        if (this._currentWinBase._actIndex === this._currentWinBase._innerIndex) {
            this._currentWinBase._innerIndex = this._currentWinBase._innerIndex === 0 ? 0 : this._currentWinBase._innerIndex - 1;
        }
        this._currentWinBase._actIndex = this._currentWinBase._actIndex === 0 ? 0 : this._currentWinBase._actIndex - 1;
        this._currentWinBase.draw();
        return this;
    }
    down() {
        this._currentWinBase._innerIndex = this._currentWinBase._innerIndex === (this._currentWinBase._inner.length - 1) ? this._currentWinBase._innerIndex : this._currentWinBase._innerIndex + 1;

        this._currentWinBase._actIndex = this._currentWinBase._actIndex === (this._currentWinBase._inner.length - 1) ? this._currentWinBase._actIndex : this._currentWinBase._actIndex + 1;

        if (this._currentWinBase._innerIndex > this._currentWinBase.height - 2 - 1) {
            this._currentWinBase._innerIndex--;
        }
        this._currentWinBase.draw();
        return this;
    }
    /**
     * 选中当前 win
     */
    _selected() {
        this._currentWinBase.selected({
            color: this._config.color
        });
        return this;
    }
    /**
     * 取消选择 其他 win
     */
    _unSelected() {
        for (let i = 0; i < this._winBaseArray.length; i++) {
            if (this._winBaseArray[i] === this._currentWinBase) continue;
            this._winBaseArray[i].unSelect();
        }
        return this;
    }
}
/**
 * win 交互窗口
 */
exports = module.exports = winBase;
/**
 * 窗口集群管理
 */
exports.cluster = cluster;