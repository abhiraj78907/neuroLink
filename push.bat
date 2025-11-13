@echo off
echo ========================================
echo   NEUROCARE - Push to GitHub
echo ========================================
echo.

echo [1/5] Initializing git...
git init
git branch -M main
echo.

echo [2/5] Setting up remote...
git remote remove origin 2>nul
git remote add origin https://github.com/abhiraj78907/neuroLink.git
echo Remote: https://github.com/abhiraj78907/neuroLink.git
echo.

echo [3/5] Staging all files...
git add .
echo.

echo [4/5] Committing changes...
git commit -m "NEUROCARE: Complete integration with Firebase, Firestore, and Gemini AI - Removed Lovable branding"
echo.

echo [5/5] Pushing to GitHub...
git push -u origin main --force
echo.

if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo   SUCCESS! Pushed to GitHub
    echo ========================================
    echo.
    echo Repository: https://github.com/abhiraj78907/neuroLink
    echo.
) else (
    echo ========================================
    echo   PUSH FAILED
    echo ========================================
    echo.
    echo You may need to authenticate.
    echo Try: git push -u origin main
    echo.
)

pause

