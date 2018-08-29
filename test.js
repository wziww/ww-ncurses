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
    height: ncurses.row(),
    width: ncurses.col(),
    x: 0,
    title: 'I\'m title!!!',
    innerColor: INNER_COLOR,
    innerIndex: 0
})
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
}, {
    value: 'that',
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
}, {
    value: 'that',
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
}, {
    value: 'that',
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
}, {
    value: 'that',
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
}, {
    value: 'that',
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
}, {
    value: 'that',
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
}, {
    value: 'that',
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
}, {
    value: 'that',
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
}, {
    value: 'that',
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
}, {
    value: 'that',
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
}, {
    value: 'that',
    index: true,
    color: inner_color_1
}, {
    value: 'that',
    index: true,
    color: inner_color_1
}]).Box().draw()
const winCluster = new win.cluster([s1], {
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