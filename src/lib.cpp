#ifndef LIB_H
#define LIB_H
#include <nan.h>
using Nan::GetFunction;
using Nan::New;
using Nan::Set;
using v8::Local;
using v8::String;
static const char *ToCString(Local<String> str)
{
    String::Utf8Value value(str);
    return *value ? *value : "<string conversion failed>";
}
#endif