@echo off
echo Cleaning up old installation...
rd /s /q node_modules
del /f /q package-lock.json

echo Installing create-react-app globally...
"C:\Program Files\nodejs\npm.cmd" install -g create-react-app

echo Installing dependencies...
"C:\Program Files\nodejs\npm.cmd" cache clean --force
"C:\Program Files\nodejs\npm.cmd" install --legacy-peer-deps

echo Starting the application...
"C:\Program Files\nodejs\npm.cmd" start

pause
