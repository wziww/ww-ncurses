const cluster = require('cluster');
const child_process = require('child_process');
const ncurses = require('./index');
const {
    CLI,
    parseCh
} = require('./index')
ncurses.initscr();
ncurses.clear();
ncurses.noecho();
ncurses.hide_cur(0);
const READ_SNACK = 1;
ncurses.start_color();
ncurses.use_default_colors();
ncurses.init_pair(READ_SNACK, ncurses.COLOR_RED, ncurses.COLOR_WHITE);
let s = new CLI({
    height: ncurses.row() - 4,
    width: 20,
    left: 0
});
s.draw();
let s2 = new CLI({
    height: ncurses.row() - 4,
    width: 20,
    left: 29
});
s2.setTips().draw();
s2.select({
}).draw();

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
            if(cmd===ncurses.KEY_RIGHT){
                s.unSelect().draw();
                s2.select({color: READ_SNACK}).draw();
            }
            if(cmd===ncurses.KEY_LEFT){
                s2.unSelect().draw();
                s.select({color: READ_SNACK}).draw();
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