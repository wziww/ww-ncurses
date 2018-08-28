{
    "targets": [
        {
            "target_name": "ncurses",
            "sources": ["src/main.cpp", "src/win.cpp"],
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ],
            "libraries":["-lncurses"]
        }
    ]
}
