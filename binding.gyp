{
    "targets": [
        {
            "target_name": "ncurses",
            "sources": ["src/main.cpp"],
            "include_dirs": [
                "<!(node -e \"require('nan')\")"
            ],
            "libraries":["-lncurses"]
        }
    ]
}
