'use strict'
const ncurses = require('./build/Release/ncurses.node');
exports = module.exports = ncurses;
const parseCh = (cmd) => {
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
exports.win = require('./lib/winhelper');
exports.parseCh = parseCh;