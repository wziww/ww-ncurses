const ncurses = require('../build/Release/ncurses.node');
const CURRENT_WIDTH = ncurses.col();
const CURRENT_HEIGHT = ncurses.row();
/**
 * win 基类
 */
class winBase {
    constructor({
        width = 0,
        height = 0,
        y = 0,
        x = 0
    } = {}) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this._win = new ncurses.Win(height, width, y, x);
        return this;
    }
    unSelect() {

    }
    selected() {}
    Box() {
        this._win.Box();
        this._win.Wrefresh();
        return this;
    }
    draw() {}
}
/**
 * win 类管理类
 */
// class cluster {
//     constructor(winBaseArray, config = {}) {
//         if (!(winBaseArray instanceof Array)) throw Error(`cluster init Error`);
//         if (!winBaseArray.length) throw Error(`cluster init Error`);
//         for (let i = 0; i < winBaseArray.length; i++) {
//             if (!(winBaseArray[i] instanceof winBase)) throw Error(`cluster init Error`);
//         }
//         this._config = config;
//         this._index = 0;
//         this._winBaseArray = winBaseArray;
//         this._currentWinBase = winBaseArray[0];
//         return this;
//     }
//     /**
//      * 节点向后选择
//      * @param {} 
//      */
//     next(bool) {
//         this._index = this._index === (this._winBaseArray.length - 1) ? 0 : (this._index + 1);
//         this._currentWinBase = this._winBaseArray[this._index];
//         if (bool) this._unSelected();
//         this._selected();
//         return this;
//     }
//     /**
//      * 节点向前选择
//      */
//     prev(bool) {
//         this._index = this._index === 0 ? (this._winBaseArray.length - 1) : (this._index - 1);
//         this._currentWinBase = this._winBaseArray[this._index];
//         if (bool) this._unSelected();
//         this._selected();
//         return this;
//     }
//     /**
//      * 选中当前 win
//      */
//     _selected() {
//         this._currentWinBase.selected({
//             color: this._config.color
//         }).draw();
//         return this;
//     }
//     /**
//      * 取消选择 其他 win
//      */
//     _unSelected() {
//         for (let i = 0; i < this._winBaseArray.length; i++) {
//             if (this._winBaseArray[i] === this._currentWinBase) continue;
//             this._winBaseArray[i].unSelect().draw();
//         }
//         return this;
//     }
// }
/**
 * win 交互窗口
 */
exports = module.exports = winBase;
/**
 * 窗口集群管理
 */
// exports.cluster = cluster;