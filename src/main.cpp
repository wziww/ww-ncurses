#include <nan.h>
#include <curses.h>
#include <sys/ioctl.h>
#include <stdio.h>
#include <unistd.h>
#include <iostream>
struct winsize w; // w.ws_row w.ws_col
using Nan::GetFunction;
using Nan::New;
using Nan::Set;
using v8::FunctionTemplate;
using v8::Local;
using v8::Number;
using v8::String;
const char *ToCString(Local<String> str)
{
  String::Utf8Value value(str);
  return *value ? *value : "<string conversion failed>";
}
NAN_METHOD(attron_)
{
  int i = info[0]->Uint32Value();
  attron(COLOR_PAIR(i));
}
NAN_METHOD(attroff_)
{
  int i = info[0]->Uint32Value();
  attroff(COLOR_PAIR(i));
}
NAN_METHOD(addCh)
{ // build went error while using `getch`
  int val = info[0]->Uint32Value();
  addch(val);
}
NAN_METHOD(cbreak)
{
  cbreak();
}
NAN_METHOD(clear)
{
  clear();
}
NAN_METHOD(echo)
{
  echo();
}
NAN_METHOD(endwin)
{
  endwin();
}
NAN_METHOD(getchar)
{
  int val = getchar();
  info.GetReturnValue().Set(val);
}
NAN_METHOD(getCh)
{ // build went error while using `getch`
  int val = getch();
  info.GetReturnValue().Set(val);
}
NAN_METHOD(has_colors)
{
  has_colors();
}
NAN_METHOD(initscr)
{
  initscr();
}
NAN_METHOD(init_pair)
{
  int i = info[0]->Uint32Value();
  int colorInner = info[1]->Uint32Value();
  int colorOuter = info[2]->Uint32Value();
  init_pair(i, colorInner, colorOuter);
}
NAN_METHOD(init_color)
{
  int color = info[0]->Uint32Value();
  int R = info[1]->Uint32Value();
  int G = info[2]->Uint32Value();
  int B = info[3]->Uint32Value();
  init_color(color, R, G, B);
}
NAN_METHOD(keypad)
{
  int boo = info[0]->Uint32Value();
  keypad(stdscr, boo);
}

NAN_METHOD(mvaddCh)
{ // build went error while using `mvaddch`
  int x = info[0]->Uint32Value();
  int y = info[1]->Uint32Value();
  int val = info[2]->Uint32Value();
  mvaddch(x, y, val);
}
NAN_METHOD(mvvLine)
{
  int x = info[0]->Uint32Value();
  int y = info[1]->Uint32Value();
  int val = info[2]->Uint32Value();
  int len = info[3]->Uint32Value();
  mvvline(x, y, val, len);
}
NAN_METHOD(mvprintw)
{
  int x = info[0]->Uint32Value();
  int y = info[1]->Uint32Value();
  const char *str = ToCString(info[2]->ToString());
  mvprintw(x, y, str);
}
NAN_METHOD(noecho)
{
  noecho();
}
NAN_METHOD(refresh)
{
  refresh();
}
NAN_METHOD(raw)
{
  raw();
}
NAN_METHOD(start_color)
{
  start_color();
}
NAN_METHOD(use_default_colors)
{
  use_default_colors();
}
/**
 * extends functions
 **/

// get current col counts
NAN_METHOD(col)
{
  ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
  info.GetReturnValue().Set(w.ws_col);
}

// hide cursor
NAN_METHOD(hide_cur)
{
  int boo = info[0]->Uint32Value();
  curs_set(boo);
}

// get current row counts
NAN_METHOD(row)
{
  ioctl(STDOUT_FILENO, TIOCGWINSZ, &w);
  info.GetReturnValue().Set(w.ws_row);
}

NAN_MODULE_INIT(InitAll)
{
  Set(target, New<String>("attron").ToLocalChecked(), GetFunction(New<FunctionTemplate>(attron_)).ToLocalChecked());
  Set(target, New<String>("attroff").ToLocalChecked(), GetFunction(New<FunctionTemplate>(attroff_)).ToLocalChecked());
  // 字符添加
  Set(target, New<String>("addch").ToLocalChecked(), GetFunction(New<FunctionTemplate>(addCh)).ToLocalChecked());

  // 清屏
  Set(target, New<String>("clear").ToLocalChecked(), GetFunction(New<FunctionTemplate>(clear)).ToLocalChecked());

  Set(target, New<String>("col").ToLocalChecked(), GetFunction(New<FunctionTemplate>(col)).ToLocalChecked());

  Set(target, New<String>("cbreak").ToLocalChecked(), GetFunction(New<FunctionTemplate>(cbreak)).ToLocalChecked());

  // 光标控制
  Set(target, New<String>("echo").ToLocalChecked(), GetFunction(New<FunctionTemplate>(echo)).ToLocalChecked());

  // 结束屏幕
  Set(target, New<String>("endwin").ToLocalChecked(), GetFunction(New<FunctionTemplate>(endwin)).ToLocalChecked());

  // 获取 I char *
  Set(target, New<String>("getchar").ToLocalChecked(), GetFunction(New<FunctionTemplate>(getchar)).ToLocalChecked());

  // 单字符输入
  Set(target, New<String>("getch").ToLocalChecked(), GetFunction(New<FunctionTemplate>(getCh)).ToLocalChecked());

  // 判断是否可用 colors
  Set(target, New<String>("has_colors").ToLocalChecked(), GetFunction(New<FunctionTemplate>(has_colors)).ToLocalChecked());

  // init screen
  Set(target, New<String>("initscr").ToLocalChecked(), GetFunction(New<FunctionTemplate>(initscr)).ToLocalChecked());

  Set(target, New<String>("init_pair").ToLocalChecked(), GetFunction(New<FunctionTemplate>(init_pair)).ToLocalChecked());

  Set(target, New<String>("init_color").ToLocalChecked(), GetFunction(New<FunctionTemplate>(init_color)).ToLocalChecked());

  Set(target, New<String>("keypad").ToLocalChecked(), GetFunction(New<FunctionTemplate>(keypad)).ToLocalChecked());

  // move & addch
  Set(target, New<String>("mvaddch").ToLocalChecked(), GetFunction(New<FunctionTemplate>(mvaddCh)).ToLocalChecked());

  Set(target, New<String>("mvvline").ToLocalChecked(), GetFunction(New<FunctionTemplate>(mvvLine)).ToLocalChecked());
  // 移动到某个位置后输出
  Set(target, New<String>("mvprintw").ToLocalChecked(), GetFunction(New<FunctionTemplate>(mvprintw)).ToLocalChecked());

  Set(target, New<String>("noecho").ToLocalChecked(), GetFunction(New<FunctionTemplate>(noecho)).ToLocalChecked());

  Set(target, New<String>("raw").ToLocalChecked(), GetFunction(New<FunctionTemplate>(raw)).ToLocalChecked());
  // 刷屏

  Set(target, New<String>("refresh").ToLocalChecked(), GetFunction(New<FunctionTemplate>(refresh)).ToLocalChecked());

  // 开始上色
  Set(target, New<String>("start_color").ToLocalChecked(), GetFunction(New<FunctionTemplate>(start_color)).ToLocalChecked());
  // 默认颜色
  Set(target, New<String>("use_default_colors").ToLocalChecked(), GetFunction(New<FunctionTemplate>(use_default_colors)).ToLocalChecked());
  /**
    * extends
    **/
  Set(target, New<String>("hide_cur").ToLocalChecked(), GetFunction(New<FunctionTemplate>(hide_cur)).ToLocalChecked());

  Set(target, New<String>("row").ToLocalChecked(), GetFunction(New<FunctionTemplate>(row)).ToLocalChecked());
  /**
    * ncurses #define
    **/
  Set(target, New<String>("A_NORMAL").ToLocalChecked(), New<Number>(A_NORMAL));
  // 加粗
  Set(target, New<String>("A_BOLD").ToLocalChecked(), New<Number>(A_BOLD));
  // 下划线
  Set(target, New<String>("A_UNDERLINE").ToLocalChecked(), New<Number>(A_UNDERLINE));
  // special key
  Set(target, New<String>("KEY_DOWN").ToLocalChecked(), New<Number>(KEY_DOWN));

  Set(target, New<String>("KEY_UP").ToLocalChecked(), New<Number>(KEY_UP));

  Set(target, New<String>("KEY_LEFT").ToLocalChecked(), New<Number>(KEY_LEFT));

  Set(target, New<String>("KEY_RIGHT").ToLocalChecked(), New<Number>(KEY_RIGHT));
  // colors
  Set(target, New<String>("COLOR_BLACK").ToLocalChecked(), New<Number>(COLOR_BLACK));

  Set(target, New<String>("COLOR_RED").ToLocalChecked(), New<Number>(COLOR_RED));

  Set(target, New<String>("COLOR_GREEN").ToLocalChecked(), New<Number>(COLOR_GREEN));

  Set(target, New<String>("COLOR_YELLOW").ToLocalChecked(), New<Number>(COLOR_YELLOW));

  Set(target, New<String>("COLOR_BLUE").ToLocalChecked(), New<Number>(COLOR_BLUE));

  Set(target, New<String>("COLOR_MAGENTA").ToLocalChecked(), New<Number>(COLOR_MAGENTA));

  Set(target, New<String>("COLOR_CYAN").ToLocalChecked(), New<Number>(COLOR_CYAN));

  Set(target, New<String>("COLOR_WHITE").ToLocalChecked(), New<Number>(COLOR_WHITE));
}

NODE_MODULE(ncurses, InitAll)