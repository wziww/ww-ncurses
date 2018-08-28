const cluster = require('cluster');
const child_process = require('child_process');
const ncurses = require('./index');
const {
    win,
    parseCh
} = require('./index');
ncurses.initscr();
ncurses.start_color();
ncurses.use_default_colors();
ncurses.clear();
ncurses.refresh();
ncurses.noecho();
ncurses.hide_cur(0);
const win_color = 1;
ncurses.init_pair(win_color, ncurses.COLOR_RED, -1);
const INNER_COLOR = 2;
ncurses.init_pair(INNER_COLOR, ncurses.COLOR_WHITE, ncurses.COLOR_BLUE);
const inner_color_1 = 3;
ncurses.init_pair(inner_color_1, ncurses.COLOR_WHITE, -1);
let s1 = new win({
    width: parseInt(ncurses.row() / 2) - 1,
    height: parseInt(ncurses.col() / 2),
    x: 0,
    title: 'I\'m title!!!',
    innerColor: INNER_COLOR,
    innerIndex: 0
})
let s2 = new win({
    width: parseInt(ncurses.row() / 2) - 1,
    height: ncurses.col() - parseInt(ncurses.col() / 2),
    x: parseInt(ncurses.col() / 2),
    title: 'who are you?',
    innerColor: INNER_COLOR
});
let s3 = new win({
    width: parseInt(ncurses.row() / 2) - 1,
    height: parseInt(ncurses.col() / 2),
    y: parseInt(ncurses.row() / 2) - 1,
    x: 0,
    title: 'Renee',
    innerColor: INNER_COLOR
})
let s4 = new win({
    width: parseInt(ncurses.row() / 2) - 1,
    height: ncurses.col() - parseInt(ncurses.col() / 2),
    y: parseInt(ncurses.row() / 2) - 1,
    x: parseInt(ncurses.col() / 2),
    title: 'xiba',
    innerColor: INNER_COLOR
});
s1.inner([{
    value: 'what???',
    index: true,
    color: inner_color_1
}, {
    value: 'that',
    index: true,
    color: inner_color_1
}, {
    value: 'that',
    index: true,
    color: inner_color_1
}]).Box().draw().selected({
    color: win_color
});
s2.inner([{
    value: 'what???',
    index: true,
    color: inner_color_1
}, {
    value: 'that',
    index: true,
    color: inner_color_1
}]).Box().draw();
s3.inner([{
    value: '😀',
    index: true,
    color: inner_color_1
}, {
    value: 'askjdgasjkg',
    index: true,
    color: inner_color_1
}]).Box().draw();
s4.inner([{
    value: '1231231???',
    index: true,
    color: inner_color_1
}, {
    value: 'saad',
    index: true,
    color: inner_color_1
}]).Box().draw();
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
            if (cmd === ncurses.KEY_UP) {
                winCluster.up(true);
            }
            if (cmd === ncurses.KEY_DOWN) {
                winCluster.down(true);
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