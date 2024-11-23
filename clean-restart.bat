@echo off
echo Cleaning project...
rd /s /q node_modules
del /f /q package-lock.json

echo Clearing npm cache...
"C:\Program Files\nodejs\npm.cmd" cache clean --force

echo Installing dependencies...
"C:\Program Files\nodejs\npm.cmd" install --legacy-peer-deps

echo Starting development server...
"C:\Program Files\nodejs\npm.cmd" start

pause
