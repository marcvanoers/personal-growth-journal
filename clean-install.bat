@echo off
echo Cleaning up old installation...
set PATH=%PATH%;C:\Program Files\nodejs
rd /s /q node_modules
del /f /q package-lock.json
echo Installing dependencies...
"C:\Program Files\nodejs\npm.cmd" cache clean --force
"C:\Program Files\nodejs\npm.cmd" install react-scripts --save-dev
"C:\Program Files\nodejs\npm.cmd" install
echo Installation complete!
pause
