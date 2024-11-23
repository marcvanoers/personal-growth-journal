@echo off
echo Starting development server...
set PATH=%PATH%;C:\Program Files\nodejs
"C:\Program Files\nodejs\npm.cmd" start
if errorlevel 1 (
    echo Error starting the development server
    echo Please check if port 3000 is available
    pause
) else (
    echo Server started successfully
)
pause
