@echo off
echo Setting up environment...
set PATH=%PATH%;C:\Program Files\nodejs

echo Cleaning previous installation...
rd /s /q node_modules 2>nul
del /f /q package-lock.json 2>nul

echo Installing dependencies one by one...
"C:\Program Files\nodejs\npm.cmd" install react@18.2.0 --save --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" install react-dom@18.2.0 --save --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" install react-scripts@5.0.1 --save-dev --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" install typescript@4.9.5 --save --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" install @mui/material@5.14.18 @emotion/react@11.11.1 @emotion/styled@11.11.0 --save --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" install @mui/icons-material@5.14.18 --save --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" install @mui/x-date-pickers@6.18.1 --save --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" install react-router-dom@6.19.0 --save --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" install axios@1.6.2 chart.js@4.4.0 date-fns@2.30.0 --save --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" install formik@2.4.5 yup@1.3.2 --save --legacy-peer-deps
"C:\Program Files\nodejs\npm.cmd" install @types/react@18.2.37 @types/react-dom@18.2.15 --save --legacy-peer-deps

echo Starting the development server...
"C:\Program Files\nodejs\npm.cmd" start

pause
