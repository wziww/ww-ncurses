const cluster = require('cluster');
const child_process = require('child_process');
const ncurses = require('./index');
const {
    CLI,
    parseCh
} = require('./index');
ncurses.initscr();
ncurses.clear();
ncurses.noecho();
ncurses.hide_cur(0);
const READ_SNACK = 1;
ncurses.start_color();
ncurses.use_default_colors();
ncurses.init_pair(READ_SNACK, ncurses.COLOR_RED, ncurses.COLOR_WHITE);
let s1 = new CLI({
    height: parseInt(ncurses.row() / 2),
    width: parseInt(ncurses.col() / 2),
    left: 0,
    char:'─'
})
let s2 = new CLI({
    height: parseInt(ncurses.row() / 2),
    width: ncurses.col() - parseInt(ncurses.col() / 2),
    left: parseInt(ncurses.col() / 2) - 1
});
let s3 = new CLI({
    height: parseInt(ncurses.row() / 2),
    width: parseInt(ncurses.col() / 2),
    top: parseInt(ncurses.row() / 2) - 1,
    left: 0
})
let s4 = new CLI({
    height: parseInt(ncurses.row() / 2),
    width: ncurses.col() - parseInt(ncurses.col() / 2),
    top: parseInt(ncurses.row() / 2) - 1,
    left: parseInt(ncurses.col() / 2) - 1
});
s2.draw();
s3.draw();
s4.draw();
const winCluster = new CLI.cluster([s1, s2, s3, s4], {
    color: READ_SNACK
});
winCluster._selected();
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