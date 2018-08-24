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
#### 线条相关
- mvvLine(int, int, char, int);  画一条以 y,x 为起点的, 以某个字符为内容的, 指定长度的水平线条
```
ncurses.mvvLine(0, 0, '*'.charCpdeAt(0),20);   // 在 0, 0 点画一条 **************** 水平线
```
#### 输入相关
- addch(char)           添加「单个」字符
```
ncurses.addch('*'.charCodeAt(0));
```
- mvaddch(int,int,char) move & add
```
ncurses.addch(0,0'*'.charCodeAt(0));
```
- getch()               获取用户输入
```
var cmd = ncurses.getch();
 <= 1
cmd === 1;
```
- noecho()              隐藏用户输入的字符 // 使用场景：例如输入密码时不显示用户输入
- cbreak()              禁止行缓冲（line buffering）// 如 处理挂起（CTRLZ）、中断或退出（CTRLC）等控制字符 交由程序处理而不产生终端信号
- keypad()              使当前输入允许使用功能键/整合键  // 如 方向键上下左右，@#￥这些特殊字符
激活后，getch() 等函数会返回 ncurses 定义的特殊常量   具体可查看 demo 下两个小游戏，关于方向键是如何处理的
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