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
    unSelect() {
        return this.drawTop().drawBottom().drawLeft().drawRight();
    }
    select({
        color = null
    } = {}) {
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
                    if (this.points[i][z].ext) {
                        ncurses.mvaddch(i + this.top, z + this.left, this.points[i][z].value | this.points[i][z].ext);
                    } else {
                        ncurses.mvaddch(i + this.top, z + this.left, this.points[i][z].value);
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
exports = module.exports = winBase;