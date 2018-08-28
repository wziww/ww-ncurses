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
    } = {}) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.title = title;
        this._win = new ncurses.Win(height, width, y, x);
        this._inner = [];
        this._innerIndex = innerIndex === 0 ? 0 : (innerIndex || -1);
        this._innerColor = innerColor;
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
        } else {
            this._inner = array;
        }
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
        for (let i = 0; i < this._inner.length; i++) {
            if (i === this._innerIndex) {
                this._win.Wattron(Number(this._innerColor));
            }
            const str = `${this._inner[i].index?i + 1 +'.  ':''}${this._inner[i].value}`;
            this._win.Mvwprintw(1 + i, 1, str);
            if (i === this._innerIndex) {
                this._win.Wattroff(Number(this._innerColor));
            }
        }
        this._win.Wrefresh();
        return this;
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
        this._currentWinBase._innerIndex = -1;
        this._currentWinBase.draw();
        this._index = this._index === (this._winBaseArray.length - 1) ? 0 : (this._index + 1);
        this._currentWinBase = this._winBaseArray[this._index];
        if (bool) this._unSelected();
        this._currentWinBase._innerIndex = 0;
        this._currentWinBase.draw();
        this._selected();
        return this;
    }
    /**
     * 节点向前选择
     */
    prev(bool) {
        this._currentWinBase._innerIndex = -1;
        this._currentWinBase.draw();
        this._index = this._index === 0 ? (this._winBaseArray.length - 1) : (this._index - 1);
        this._currentWinBase = this._winBaseArray[this._index];
        if (bool) this._unSelected();
        this._currentWinBase._innerIndex = 0;
        this._currentWinBase.draw();
        this._selected();
        return this;
    }
    up() {
        this._currentWinBase._innerIndex = this._currentWinBase._innerIndex === 0 ? 0 : this._currentWinBase._innerIndex - 1;
        this._currentWinBase.draw();
        return this;
    }
    down() {
        this._currentWinBase._innerIndex = this._currentWinBase._innerIndex === (this._currentWinBase._inner.length - 1) ? 0 : this._currentWinBase._innerIndex + 1;
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