@echo off
echo Cleaning up node_modules and package-lock.json...
rd /s /q node_modules
del /f /q package-lock.json

echo Installing core dependencies...
"C:\Program Files\nodejs\npm.cmd" install react-scripts@5.0.1 --save-dev
"C:\Program Files\nodejs\npm.cmd" install react@18.2.0 react-dom@18.2.0 --save

echo Installing additional dependencies...
"C:\Program Files\nodejs\npm.cmd" install

pause
