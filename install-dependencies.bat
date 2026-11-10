@echo off
setlocal
cd /d "%~dp0"

echo Installing EventDiscovery dependencies...
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is required. Install Node.js 22 or newer, then run this file again.
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm was not found. Reinstall Node.js with npm, then run this file again.
    exit /b 1
)

for /f "tokens=1 delims=.v" %%V in ('node -v') do set NODE_MAJOR=%%V
if %NODE_MAJOR% LSS 22 (
    echo ERROR: Node.js 22 or newer is required by package.json. Found:
    node -v
    exit /b 1
)

echo Installing root, frontend, and CMS npm dependencies from package-lock.json...
npm ci
if errorlevel 1 (
    echo ERROR: npm dependency installation failed.
    exit /b 1
)

where py >nul 2>nul
if not errorlevel 1 (
    echo.
    echo Installing optional Python tools from requirements.txt...
    py -m pip install -r requirements.txt
    if errorlevel 1 echo WARNING: Optional Python dependency installation failed.
) else (
    where python >nul 2>nul
    if not errorlevel 1 (
        echo.
        echo Installing optional Python tools from requirements.txt...
        python -m pip install -r requirements.txt
        if errorlevel 1 echo WARNING: Optional Python dependency installation failed.
    ) else (
        echo.
        echo Python not found; skipping optional requirements.txt packages.
    )
)

echo.
echo Dependency installation finished.
echo Start the frontend with: npm run dev
echo Start the CMS with: npm run dev:cms
exit /b 0
