## 让我们来愉快地在 NodeJS 中使用 C 库  「ncurses」 编写适合自己的 CLI 应用 
```
npm install ww-ncurses --save
```
```
var ncurses = require('ww-ncurses');
ncurses.initsrc();
```
## 基本概念
方向：· → y
     ↓
     x
终端左上角坐标为 (0,0)
### API 基本使用方式同步于 ncurses 在 C/CPP 中的使用方式

#### 窗口相关
- initscr()             初始化窗口
- clear()               清屏
- col()                 获取窗口「列数」
- row()                 获取窗口「行数」
- endwin()              结束窗口
- refresh()             将缓冲区内字符显示到窗口上
#### 输入相关
- addch(char)               添加「单个」字符
- mvaddch(int,int,char)     move & add
```
ncurses.addch('*');
```
#### 光标相关
- hide_cur(int)         0 隐藏光标 1 显示光标
```
ncurses.hide_cur(1);
```
#### 字体相关
- A_NORMAL              常规
- A_BOLD                加粗
- A_UNDERLINE           下划线
```
用法：ncurses.mvaddch(10, 10,'*'.charCodeAt(0) | ncurses.A_UNDERLINE);
```
#### 按键相关
- KEY_DOWN
- KEY_UP
- KEY_LEFT
- KEY_RIGHT
#### 颜色相关
- start_color()         开始上色
- use_default_colors()  使用默认颜色
- init_pair(int,A,B)    自定义颜色    
```
int 自定义颜色下标 A ncurses 定义的内颜色常量  B ncurses 定义的外颜色常量   如：
ncurses.init_pair(1, ncurses.COLOR_RED, ncurses.COLOR_BLACK)
```
- attron(int)           使用自定义颜色下标开始着色 如：定义了一个颜色的下标为 1 则 attron(1);
- attroff(int)          停止某个下标颜色的着色

---
##### 颜色常量
- COLOR_BLACK
- COLOR_RED
- COLOR_GREEN
- COLOR_YELLOW
- COLOR_BLUE
- COLOR_MAGENTA
- COLOR_CYAN
- COLOR_WHITE