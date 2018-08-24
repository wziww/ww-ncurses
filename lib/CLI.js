const ncurses = require('../build/Release/ncurses.node');
const CURRENT_WIDTH = ncurses.col();
const CURRENT_HEIGHT = ncurses.row();
/**
 * win 基类
 */
class winBase {
    constructor({
        height = CURRENT_HEIGHT,
        width = CURRENT_WIDTH,
        top = 0,
        left = 0,
        char = '*',
        points = []
    } = {}) {
        this.height = height;
        this.width = width;
        this.top = top;
        this.left = left;
        const _points = [];
        this.char = (('' + Number(char)) === ('' + char)) ? char : char.charCodeAt(0);
        for (let i = 0; i < this.height; i++) {
            _points[i] = [];
            for (let z = 0; z < this.width; z++) {
                _points[i].push(false);
            }
        }
        this.points = (points.length > 0 ? points : _points) || _points;
        this.drawTop();
        this.drawBottom();
        this.drawLeft();
        this.drawRight();
        return this;
    }
    unSelect() {
        this._selected = true;
        return this.drawTop().drawBottom().drawLeft().drawRight();
    }
    selected({
        color = null
    } = {}) {
        this._selected = true;
        return this.drawTop({
            color
        }).drawBottom({
            color
        }).drawLeft({
            color
        }).drawRight({
            color
        });
    }
    drawTop(obj = {}) {
        for (let i = 0; i < this.width; i++) {
            this.points[0][i] = {
                value: this.char,
                color: obj.color
            };
        }
        return this;
    }
    drawBottom(obj = {}) {
        for (let i = 0; i < this.width; i++) {
            this.points[this.height - 1][i] = {
                value: this.char,
                color: obj.color
            };
        }
        return this;
    }
    drawLeft(obj = {}) {
        for (let i = 1; i < this.height - 1; i++) {
            this.points[i][0] = {
                value: this.char,
                color: obj.color
            };
        }
        return this;
    }
    drawRight(obj = {}) {
        for (let i = 1; i < this.height - 1; i++) {
            this.points[i][this.width - 1] = {
                value: this.char,
                color: obj.color
            };
        }
        return this;
    }
    draw() {
        for (let i = 0; i < this.points.length; i++) {
            for (let z = 0; z < this.points[i].length; z++) {
                if (this.points[i][z] !== false) {
                    ncurses.attron(this.points[i][z].color);
                    let _function = ncurses.mvaddch;
                    if (this.points[i][z].ext) {
                        _function(i + this.top, z + this.left, this.points[i][z].value | this.points[i][z].ext, 1);
                    } else {
                        _function(i + this.top, z + this.left, this.points[i][z].value, 1);
                    }
                    ncurses.attroff(this.points[i][z].color);
                }
            }
        }
        ncurses.refresh();
    }
    setTips(tips = []) {
        for (let i = 0;
            (i < (tips.length > 4 ? 4 : tips.length)) && i < this.height - 1; i++) {
            this.points.push([]);
            const tip = tips[i];
            if (tip.value) {
                for (let z = 0; z < tip.value.length; z++) {
                    this.points[this.height + i][z] = Object.assign({}, tip, {
                        value: tip.value[z].charCodeAt(0)
                    });
                }
            }
        }
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
        this._index = 0;
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
    /**
     * 选中当前 win
     */
    _selected() {
        this._currentWinBase.selected({
            color: this._config.color
        }).draw();
        return this;
    }
    /**
     * 取消选择 其他 win
     */
    _unSelected() {
        for (let i = 0; i < this._winBaseArray.length; i++) {
            if (this._winBaseArray[i] === this._currentWinBase) continue;
            this._winBaseArray[i].unSelect().draw();
        }
        return this;
    }
}
/**
 * CLI 交互窗口
 */
exports = module.exports = winBase;
/**
 * 窗口集群管理
 */
exports.cluster = cluster;