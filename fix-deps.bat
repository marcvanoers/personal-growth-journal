@echo off
echo Installing ajv dependencies...
call npm install ajv@8.12.0 ajv-keywords@5.1.0 --save-exact --legacy-peer-deps

echo Cleaning node_modules\\.cache...
rd /s /q "node_modules\.cache" 2>nul

echo Starting the development server...
call npm start

pause
