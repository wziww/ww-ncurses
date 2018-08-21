// · → y
// ↓ 
// x
// 俄罗斯方块小游戏

//    *   **  *        **
//   ***  **  **  ****  **
//
const ncurses = require('../build/Release/ncurses.node');
const cluster = require('cluster');
const child_process = require('child_process');
const _LINE = 1;
const WINDOW_WIDTH = 20; //ncurses.col();
const WINDOW_HEIGHT = ncurses.row();
const failX = 1;
const failY = parseInt((WINDOW_WIDTH - 2) / 2);
const READ_SNACK = 1;
let CURRENT_NODE = null;
let points = [];
let _currentClass;
const draw = () => {
    ncurses.clear();
    for (let i = 0; i < points.length; i++) {
        for (let z = 0; z < points[i].length; z++) {
            if (points[i][z]) {
                ncurses.mvaddch(i, z, "*".charCodeAt(0));
            }
        }
    }
    ncurses.refresh();
}
class base {
    constructor() {
        this.x = failX;
        this.y = failY;
        this.index = 0;
    }
    left() {
        this.y--;
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            if (points[point[0]][point[1] - 1] && this.points.join('|').indexOf([point[0], point[1] - 1].toString()) == -1) return
        }
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            points[point[0]][point[1]] = false;
            this.points[i][1]--;
        }
    }
    right() {
        this.y++;
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            if (points[point[0]][point[1] + 1] && this.points.join('|').indexOf([point[0], point[1] + 1].toString()) == -1) return
        }
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            points[point[0]][point[1]] = false;
            this.points[i][1]++;
        }
    }
    down() {
        this.x++;
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            if (points[point[0] + 1][point[1]] && this.points.join('|').indexOf([point[0] + 1, point[1]].toString()) == -1) return 'new'
        }
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            points[point[0]][point[1]] = false;
            this.points[i][0]++;
        }
    }
    draw() {
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            points[point[0]][point[1]] = true;
        }
        return draw();
    }
}
class O extends base {
    constructor() {
        super();
        this.points = [
            [this.x, this.y],
            [this.x + 1, this.y],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1]
        ];
    }
}
class T extends base {
    constructor() {
        super();
        this.points = [
            [this.x, this.y],
            [this.x + 1, this.y - 1],
            [this.x + 1, this.y],
            [this.x + 1, this.y + 1]
        ];
    }
    top() {
        let _points = [];
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            points[point[0]][point[1]] = false;
        }
        this.index++;
        switch (this.index) {
            case 0:
                _points = [
                    [this.x, this.y],
                    [this.x + 1, this.y - 1],
                    [this.x + 1, this.y],
                    [this.x + 1, this.y + 1]
                ];
                break;
            case 1:
                _points = [
                    [this.x, this.y],
                    [this.x + 1, this.y],
                    [this.x - 1, this.y],
                    [this.x, this.y + 1]
                ];
                break;
            case 2:
                _points = [
                    [this.x, this.y],
                    [this.x + 1, this.y],
                    [this.x, this.y - 1],
                    [this.x, this.y + 1]
                ];
                break;
            case 3:
                _points = [
                    [this.x, this.y],
                    [this.x, this.y + 1],
                    [this.x + 1, this.y + 1],
                    [this.x - 1, this.y + 1]
                ];
                this.index = -1;
                break;
        }
        this.points = _points;
    }
}
class I extends base {
    constructor() {
        super();
        this.points = [
            [this.x, this.y],
            [this.x + 1, this.y],
            [this.x + 2, this.y],
            [this.x + 3, this.y]
        ];
    }
    top() {
        let _points = [];
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            points[point[0]][point[1]] = false;
        }
        this.index++;
        switch (this.index) {
            case 0:
                _points = [
                    [this.x, this.y],
                    [this.x + 1, this.y],
                    [this.x + 2, this.y],
                    [this.x + 3, this.y]
                ];
                break;
            case 1:
                _points = [
                    [this.x + 3, this.y - 1],
                    [this.x + 3, this.y],
                    [this.x + 3, this.y + 1],
                    [this.x + 3, this.y + 2]
                ];
                this.index = -1;
                break;
        }
        this.points = _points;
    }
}
class Z extends base {
    constructor() {
        super();
        this.points = [
            [this.x, this.y],
            [this.x, this.y + 1],
            [this.x + 1, this.y + 1],
            [this.x + 1, this.y + 2]
        ];
    }
    top() {
        let _points = [];
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            points[point[0]][point[1]] = false;
        }
        this.index++;
        switch (this.index) {
            case 0:
                _points = [
                    [this.x, this.y],
                    [this.x, this.y + 1],
                    [this.x + 1, this.y + 1],
                    [this.x + 1, this.y + 2]
                ];
                break;
            case 1:
                _points = [
                    [this.x, this.y],
                    [this.x - 1, this.y + 1],
                    [this.x, this.y + 1],
                    [this.x + 1, this.y]
                ];
                this.index = -1;
                break;
        }
        this.points = _points;
    }
}
class L extends base {
    constructor() {
        super();
        this.points = [
            [this.x, this.y],
            [this.x + 1, this.y],
            [this.x + 1, this.y + 1]
        ];
    }
    top() {
        let _points = [];
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            points[point[0]][point[1]] = false;
        }
        this.index++;
        switch (this.index) {
            case 0:
                _points = [
                    [this.x, this.y],
                    [this.x + 1, this.y],
                    [this.x + 1, this.y + 1]
                ];
                break;
            case 1:
                _points = [
                    [this.x, this.y],
                    [this.x, this.y + 1],
                    [this.x + 1, this.y]
                ];
                break;
            case 2:
                _points = [
                    [this.x, this.y],
                    [this.x, this.y + 1],
                    [this.x + 1, this.y + 1]
                ];
                break;
            case 3:
                _points = [
                    [this.x + 1, this.y],
                    [this.x, this.y + 1],
                    [this.x + 1, this.y + 1]
                ];
                this.index = -1;
                break;
        }
        this.points = _points;
    }
}
let _NODES = [O, T, I, Z, L];
ncurses.initscr();
ncurses.start_color();
ncurses.use_default_colors();
ncurses.init_pair(READ_SNACK, ncurses.COLOR_RED, ncurses.COLOR_BLACK);

for (let i = 0; i < WINDOW_HEIGHT - _LINE; i++) {
    points[i] = [];
    for (let z = 0; z < WINDOW_WIDTH; z++) {
        points[i][z] = false;
    }
}
const _parseCh = (cmd) => {
    switch (cmd) {
        case ncurses.KEY_DOWN:
            return ncurses.KEY_DOWN;
        case ncurses.KEY_UP:
            return ncurses.KEY_UP;
        case ncurses.KEY_LEFT:
            return ncurses.KEY_LEFT;
        case ncurses.KEY_RIGHT:
            return ncurses.KEY_RIGHT;
        default:
            return String.fromCharCode(cmd);
    }
}

function _refresh() {
    points = [];
    for (let i = 0; i < WINDOW_WIDTH; i++) {
        points[i] = [];
        for (let z = 0; z < WINDOW_HEIGHT - _LINE; z++) {
            points[i][z] = false;
        }
    }
    ncurses.clear();
    //top line
    for (let i = 0; i < WINDOW_WIDTH; i++) {
        points[0][i] = true;
    }
    //bottom line
    for (let i = 0; i < WINDOW_WIDTH; i++) {
        points[WINDOW_HEIGHT - _LINE][i] = true;
    }
    //left line
    for (let i = 1; i < WINDOW_HEIGHT - _LINE; i++) {
        points[i][0] = true;
    }
    //right line
    for (let i = 1; i < WINDOW_HEIGHT - _LINE; i++) {
        points[i][WINDOW_WIDTH - 1] = true;
    }
    ncurses.hide_cur(0);
}
_refresh();
draw();
const delLine = (INDEX, bool) => {
    if (!bool) return;
    for (let i = INDEX; i > 1; i--) {
        for (let z = 1; z < WINDOW_WIDTH - 1; z++) {
            points[i][z] = points[i - 1][z];
        }
    }
    return draw();
}
const checkScore = () => {
    for (let i = points.length - 2; i > 1; i--) {
        let del = true;
        for (let z = 1; z < WINDOW_WIDTH - 1; z++) {
            if (!points[i][z]) del = false;
        }
        delLine(i, del);
        if (del) i++;
    }
}
const move = (cmd, _class) => {
    _refresh
    switch (cmd) {
        case ncurses.KEY_DOWN:
            if (_class.down() === 'new') {
                CURRENT_NODE = new _NODES[parseInt(Math.random() * 50) % 5]();
                _class = CURRENT_NODE;
                checkScore();
                _class.draw();
            } else {
                _class.draw()
            }
            break;
        case ncurses.KEY_UP:
            _class.top();
            _class.draw();
            break;
        case ncurses.KEY_LEFT:
            _class.left();
            _class.draw();
            break;
        case ncurses.KEY_RIGHT:
            _class.right();
            _class.draw();
            break;
        default:
            return;
    }
}
const z = _NODES[parseInt(Math.random() * 50) % 5];
let C = new z();
CURRENT_NODE = C;
if (cluster.isMaster) {
    const quit = () => {
        const spawn = child_process.spawnSync;
        spawn('kill', [child.process.pid]);
        ncurses.endwin();
        process.exit(0);
    }
    setInterval(() => {
        if (move(ncurses.KEY_DOWN, CURRENT_NODE) === 'q') return quit();
    }, 300);
    // setInterval(() => {}, 1000);
    const child = cluster.fork();
    process.on('uncaughtException', function (err) {
        return quit();
    });
    cluster.on('message', (worker, cmd, handle) => {
        if (cmd == 'q') {
            return quit();
        } else {
            if (move(cmd, CURRENT_NODE) === 'q') return quit();
        }
    });
} else {
    while (true) {
        ncurses.cbreak();
        ncurses.keypad(true);
        ncurses.noecho();
        let cmd = ncurses.getch()
        cmd = _parseCh(cmd);
        process.send(cmd);
    }
}