#include <nan.h>
#include <ncurses.h>
#include <iostream>
using namespace std;
static Nan::Persistent<v8::Function> my_constructor;
class Win : public Nan::ObjectWrap
{
  public:
    int _height = 0;
    int _width = 0;
    int _starty = 0;
    int _startx = 0;
    WINDOW *local_win = NULL;
    static NAN_MODULE_INIT(Init)
    {
        v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
        tpl->SetClassName(Nan::New("Win").ToLocalChecked());
        tpl->InstanceTemplate()->SetInternalFieldCount(7);
        Nan::SetPrototypeMethod(tpl, "Box", Box);
        Nan::SetPrototypeMethod(tpl, "Wrefresh", Wrefresh);
        Nan::SetPrototypeMethod(tpl, "Wattron", Wattron);
        Nan::SetPrototypeMethod(tpl, "Wattroff", Wattroff);
        my_constructor.Reset(Nan::GetFunction(tpl).ToLocalChecked());
        Nan::Set(target, Nan::New<v8::String>("Win").ToLocalChecked(), Nan::GetFunction(tpl).ToLocalChecked());
    }
    static NAN_METHOD(Box)
    {
        Win *win = Nan::ObjectWrap::Unwrap<Win>(info.This());
        box(win->local_win, 0, 0);
    }
    static NAN_METHOD(Wrefresh)
    {
        Win *win = Nan::ObjectWrap::Unwrap<Win>(info.This());
        wrefresh(win->local_win);
    }
    static NAN_METHOD(Mvwin)
    {
        Win *win = Nan::ObjectWrap::Unwrap<Win>(info.This());
        int y = info[0]->Uint32Value();
        int x = info[1]->Uint32Value();
        mvwin(win->local_win, y, x);
    }
    static NAN_METHOD(Wattron)
    {
        Win *win = Nan::ObjectWrap::Unwrap<Win>(info.This());
        int _color = info[0]->Uint32Value();
        wattron(win->local_win, COLOR_PAIR(_color));
    }
    static NAN_METHOD(Wattroff)
    {
        Win *win = Nan::ObjectWrap::Unwrap<Win>(info.This());
        int _color = info[0]->Uint32Value();
        wattroff(win->local_win, COLOR_PAIR(_color));
    }

  private:
    explicit Win(int height = 0, int width = 0, int starty = 0, int startx = 0) : _height(height), _width(width), _starty(starty), _startx(startx)
    {
        this->local_win = newwin(height, width, starty, startx);
    }
    ~Win() {}
    static NAN_METHOD(New)
    {
        if (info.IsConstructCall())
        {
            int width = info[0]->Uint32Value();
            int height = info[1]->Uint32Value();
            int starty = info[2]->Uint32Value();
            int startx = info[3]->Uint32Value();
            Win *win = new Win(height, width, starty, startx);
            win->Wrap(info.This());
            info.GetReturnValue().Set(info.This());
        }
        else
        {
            info.GetReturnValue().Set(Nan::Error("Win should be called in construct"));
        }
    }
};