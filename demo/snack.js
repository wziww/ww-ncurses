// · → x
// ↓ 
// y
// 贪吃蛇小游戏
const ncurses = require('../build/Release/ncurses.node');
const cluster = require('cluster');
const child_process = require('child_process');
const _LINE = 1;
const READ_SNACK = 1;
let seed = false;
let point = [
    [1, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6]
];
let points = [];
let way = ncurses.KEY_RIGHT;

ncurses.initscr();
ncurses.start_color();
ncurses.use_default_colors();
ncurses.init_pair(READ_SNACK, ncurses.COLOR_RED, ncurses.COLOR_BLACK);

for (let i = 0; i < ncurses.col(); i++) {
    points[i] = [];
    for (let z = 0; z < ncurses.row() - _LINE; z++) {
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
    for (let i = 0; i < ncurses.col(); i++) {
        points[i] = [];
        for (let z = 0; z < ncurses.row() - _LINE; z++) {
            points[i][z] = false;
        }
    }
    ncurses.clear();
    //top line
    for (let i = 0; i < ncurses.col(); i++) {
        ncurses.mvaddch(0, i, "*".charCodeAt(0));
        points[0][i] = true;
    }
    //bottom line
    for (let i = 0; i < ncurses.col(); i++) {
        ncurses.mvaddch(ncurses.row() - _LINE, i, "*".charCodeAt(0));
        points[ncurses.row() - _LINE][i] = true;
    }
    //left line
    for (let i = 1; i < ncurses.row() - _LINE; i++) {
        ncurses.mvaddch(i, 0, "*".charCodeAt(0));
        points[i][0] = true;
    }
    //right line
    for (let i = 1; i < ncurses.row() - _LINE; i++) {
        ncurses.mvaddch(i, ncurses.col() - 1, "*".charCodeAt(0));
        points[i][ncurses.col() - 1] = true;
    }
    if (seed) {
        points[seed[0]][seed[1]] = 'bingo';
    }
    ncurses.hide_cur(0);
    ncurses.refresh();
}
_refresh();
printSnack();
// 画个蛇皮
function printSnack() {
    ncurses.attron(READ_SNACK);
    for (let i = 0; i < point.length; i++) {
        ncurses.mvaddch(point[i][0], point[i][1], "*".charCodeAt(0));
        points[point[i][0]][point[i][1]] = true;
    }
    ncurses.attroff(READ_SNACK);
    ncurses.refresh();
}
// 蛇蛇爬行
const move = (cmd) => {
    //别缩回去
    switch (cmd) {
        case ncurses.KEY_DOWN:
            if (point[point.length - 1][0] + 1 === point[point.length - 2][0]) return;
            break;
        case ncurses.KEY_UP:
            if (point[point.length - 1][0] - 1 === point[point.length - 2][0]) return;
            break;
        case ncurses.KEY_LEFT:
            if (point[point.length - 1][1] - 1 === point[point.length - 2][1]) return;
            break;
        case ncurses.KEY_RIGHT:
            if (point[point.length - 1][1] + 1 === point[point.length - 2][1]) return;
            break;
        default:
            return;
    }
    way = cmd;
    _refresh();
    ncurses.mvaddch(seed[0], seed[1], '*'.charCodeAt(0)); //  点点  在蛇爬动之前生成
    ncurses.refresh();
    const _last = [point[0][0], point[0][1]];
    for (let i = 0; i < point.length - 1; i++) {
        point[i][0] = point[i + 1][0];
        point[i][1] = point[i + 1][1];
    }
    switch (cmd) {
        case ncurses.KEY_DOWN:
            point[point.length - 1][0]++;
            break;
        case ncurses.KEY_UP:
            point[point.length - 1][0]--;
            break;
        case ncurses.KEY_LEFT:
            point[point.length - 1][1]--;
            break;
        case ncurses.KEY_RIGHT:
            point[point.length - 1][1]++;
            break;
        default:
            break;
    }
    const _point = point[point.length - 1];
    if (points[_point[0]][_point[1]] === 'bingo') { // 吃掉
        point = [_last, ...point];
        seed = false;
        return printSnack();
    }
    if (points[_point[0]][_point[1]]) return 'q';
    printSnack();
}
if (cluster.isMaster) {
    const quit = () => {
        const spawn = child_process.spawnSync;
        spawn('kill', [child.process.pid]);
        ncurses.endwin();
        process.exit(0);
    }
    setInterval(() => {
        if (move(way) === 'q') return quit();
    }, 300);
    setInterval(() => {
        if (seed) return;
        const arr = [];
        for (let i = 0; i < points.length; i++) {
            for (let z = 0; z < points[i].length; z++) {
                if (!points[i][z]) arr.push([i, z]);
            }
        }
        seed = arr[parseInt((arr.length - 1) / parseInt(Math.random() * 10))] || arr[4];
    }, 1000);
    const child = cluster.fork();
    process.on('uncaughtException', function (err) {
        return quit();
    });
    cluster.on('message', (worker, cmd, handle) => {
        if (cmd == 'q') {
            return quit();
        } else {
            if (move(cmd) === 'q') return quit();
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