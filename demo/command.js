// · → x
// ↓ 
// y
// 贪吃蛇小游戏
const ncurses = require('../build/Release/ncurses.node');
const cluster = require('cluster');
const child_process = require('child_process');
const _LINE = 1;
const READ_SNACK = 1;
ncurses.initscr();
ncurses.start_color();
ncurses.use_default_colors();
ncurses.init_pair(READ_SNACK, ncurses.COLOR_RED, ncurses.COLOR_BLACK);
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
if (cluster.isMaster) {
    const quit = () => {
        const spawn = child_process.spawnSync;
        spawn('kill', [child.process.pid]);
        ncurses.endwin();
        process.exit(0);
    }
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