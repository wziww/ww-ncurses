const cluster = require('cluster');
const child_process = require('child_process');
const ncurses = require('./index');
const {
    CLI
} = require('./index')
ncurses.initscr();
let s = new CLI({
    height: ncurses.row() - 4
});
s.setTips(['', '1. -q quit', '2. I\'m No.2']).draw();


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
        } else {}
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