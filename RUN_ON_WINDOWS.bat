@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 22.13+ from https://nodejs.org/
  pause
  exit /b 1
)
echo ==============================================
echo   AppDev Tutorial - Windows Local Launcher
 echo ==============================================
if not exist node_modules\ (
  echo First run: installing packages. Internet required...
  call npm install
  if errorlevel 1 (
    echo npm install failed. Check your internet connection.
    pause
    exit /b 1
  )
  call npx expo install --fix
  if errorlevel 1 (
    echo Dependency alignment failed. See README.md.
    pause
    exit /b 1
  )
)
echo Starting local web app. Close this window to stop it.
call npm run web
pause
endlocal
