@echo off
echo Setting up environment...
set PATH=C:\Program Files\nodejs;%PATH%

echo Cleaning up...
rd /s /q node_modules 2>nul
del /f /q package-lock.json 2>nul

echo Installing core dependencies first...
call npm install react@18.2.0 react-dom@18.2.0 typescript@4.9.5 @types/react@18.2.37 @types/react-dom@18.2.15 --save --legacy-peer-deps
if errorlevel 1 goto error

echo Installing dev dependencies...
call npm install react-scripts@5.0.1 --save-dev --legacy-peer-deps
if errorlevel 1 goto error

echo Installing remaining dependencies...
call npm install @mui/material@5.14.18 @emotion/react@11.11.1 @emotion/styled@11.11.0 @mui/icons-material@5.14.18 @mui/x-date-pickers@6.18.1 react-router-dom@6.19.0 axios@1.6.2 chart.js@4.4.0 react-chartjs-2@5.2.0 date-fns@2.30.0 formik@2.4.5 yup@1.3.2 --save --legacy-peer-deps
if errorlevel 1 goto error

echo Starting the development server...
call npm start
if errorlevel 1 goto error

goto end

:error
echo Failed with error #%errorlevel%.
pause
exit /b %errorlevel%

:end
pause
