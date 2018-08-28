const cluster = require('cluster');
const child_process = require('child_process');
const ncurses = require('./index');
const {
    win,
    parseCh
} = require('./index');
const win_color = 1;
ncurses.initscr();
ncurses.start_color();
ncurses.use_default_colors();
ncurses.init_pair(win_color, ncurses.COLOR_RED, -1);
ncurses.clear();
ncurses.refresh();
ncurses.noecho();
ncurses.hide_cur(0);
let s1 = new win({
    width: parseInt(ncurses.row() / 2) - 1,
    height: parseInt(ncurses.col() / 2),
    x: 0,
    char: 0
})
let s2 = new win({
    width: parseInt(ncurses.row() / 2) - 1,
    height: ncurses.col() - parseInt(ncurses.col() / 2),
    x: parseInt(ncurses.col() / 2)
});
let s3 = new win({
    width: parseInt(ncurses.row() / 2) - 1,
    height: parseInt(ncurses.col() / 2),
    y: parseInt(ncurses.row() / 2) - 1,
    x: 0
})
let s4 = new win({
    width: parseInt(ncurses.row() / 2) - 1,
    height: ncurses.col() - parseInt(ncurses.col() / 2),
    y: parseInt(ncurses.row() / 2) - 1,
    x: parseInt(ncurses.col() / 2)
});
s1.selected({
    color: win_color
});
s2.Box();
s3.Box();
s4.Box();
const winCluster = new win.cluster([s1, s2, s3, s4], {
    color: win_color
});
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
            if (cmd === ncurses.KEY_RIGHT) {
                winCluster.next(true);
            }
            if (cmd === ncurses.KEY_LEFT) {
                winCluster.prev(true);
            }
        }
    });
} else {
    while (true) {
        ncurses.cbreak();
        ncurses.keypad(true);
        ncurses.noecho();
        let cmd = ncurses.getch()
        cmd = parseCh(cmd);
        process.send(cmd);
    }
}