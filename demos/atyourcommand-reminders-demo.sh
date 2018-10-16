#!/usr/bin/env bash
# Make a new reminder via terminal script
# args: remind <title> <date> <time>

# Adapted from https://apple.stackexchange.com/a/113022/206073
# e.g., ./atyourcommand-reminders-demo.sh "must do xyz"
# e.g., ./atyourcommand-reminders-demo.sh "must do xyz" 2020/01/01 01:00:00PM

if (( $# < 2 )); then
    osascript - "$1" <<END
    on run argv
        tell application "Reminders"
            make new reminder with properties {name:item 1 of argv}
        end tell
    end run
END
else
    osascript - "$1" "$2" "$3" <<END
    on run argv
        set stringedAll to date (item 2 of argv & " " & item 3 of argv)
        tell application "Reminders"
            make new reminder with properties {name:item 1 of argv, due date:stringedAll}
        end tell
    end run
END
fi
