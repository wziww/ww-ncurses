const ncurses = require('../build/Release/ncurses.node');
const CURRENT_WIDTH = ncurses.col();
const CURRENT_HEIGHT = ncurses.row();
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
        this.char = char.charCodeAt(0);
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
    drawTop() {
        for (let i = 0; i < this.width; i++) {
            this.points[0][i] = this.char;
        }
    }
    drawBottom() {
        for (let i = 0; i < this.width; i++) {
            this.points[this.height - 1][i] = this.char;
        }
    }
    drawLeft() {
        for (let i = 1; i < this.height - 1; i++) {
            this.points[i][0] = this.char;
        }
    }
    drawRight() {
        for (let i = 1; i < this.height - 1; i++) {
            this.points[i][this.width - 1] = this.char;
        }
    }
    draw() {
        for (let i = 0; i < this.points.length; i++) {
            for (let z = 0; z < this.points[i].length; z++) {
                if (this.points[i][z] !== false) {
                    ncurses.mvaddch(i + this.top, z + this.left, this.points[i][z]);
                }
            }
        }
        ncurses.refresh();
    }
    setTips(tips) {
        for (let i = 0;
            (i < (tips.length > 4 ? 4 : tips.length)) && i < this.height - 1; i++) {
            const tip = '' + tips[i];
            this.points.push([]);
            for (let z = 0; z < tip.length; z++) {
                this.points[this.height + i][z] = tip[z].charCodeAt(0);
            }
        }
        return this;
    }
}
exports = module.exports = winBase;