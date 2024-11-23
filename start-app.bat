@echo off
echo Setting up environment...
set PATH=C:\Program Files\nodejs;%PATH%
set NODE_PATH=C:\Program Files\nodejs\node_modules

echo Starting the development server...
"C:\Program Files\nodejs\node.exe" "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" start

pause
