# Push to GitHub Repository Script
# Repository: https://github.com/abhiraj78907/neuroLink

Write-Host "=== Pushing brain-insight-dash to GitHub ===" -ForegroundColor Cyan
Write-Host "Repository: https://github.com/abhiraj78907/neuroLink" -ForegroundColor Yellow
Write-Host ""

# Check if git is installed
try {
    $null = git --version 2>&1
    Write-Host "[✓] Git is installed" -ForegroundColor Green
} catch {
    Write-Host "[✗] Git is not installed. Please install Git first." -ForegroundColor Red
    exit 1
}

# Initialize git if needed
if (-not (Test-Path .git)) {
    Write-Host "[!] Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "[✓] Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "[✓] Git repository already initialized" -ForegroundColor Green
}

# Set up remote
Write-Host "[!] Setting up remote repository..." -ForegroundColor Yellow
git remote remove origin 2>$null
git remote add origin https://github.com/abhiraj78907/neuroLink.git
Write-Host "[✓] Remote added: https://github.com/abhiraj78907/neuroLink.git" -ForegroundColor Green

# Check status
Write-Host ""
Write-Host "[!] Checking git status..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "[!] Found changes to commit" -ForegroundColor Yellow
    
    # Add all files
    Write-Host "[!] Adding all files..." -ForegroundColor Yellow
    git add .
    Write-Host "[✓] Files staged" -ForegroundColor Green
    
    # Commit
    Write-Host "[!] Committing changes..." -ForegroundColor Yellow
    git commit -m "Initial commit: NEUROCARE - AI-Powered Alzheimer's Detection Platform

- Integrated Firebase Authentication with role-based access (doctor, caregiver, patient)
- Implemented Firestore for real-time data storage and synchronization
- Added Gemini AI integration for facial recognition and speech analysis
- Created AI processing pipeline with upload and live stream support
- Built comprehensive UI components for AI analysis and status tracking
- Added demo accounts with automatic creation
- Implemented modular, scalable architecture for future AI modalities"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[✓] Changes committed" -ForegroundColor Green
    } else {
        Write-Host "[✗] Commit failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[!] No changes to commit" -ForegroundColor Yellow
}

# Push to remote
Write-Host ""
Write-Host "[!] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "This may require authentication." -ForegroundColor Cyan
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[✓] Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/abhiraj78907/neuroLink" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "[✗] Push failed. Possible reasons:" -ForegroundColor Red
    Write-Host "  1. Authentication required - you may need to:" -ForegroundColor Yellow
    Write-Host "     - Use GitHub CLI: gh auth login" -ForegroundColor White
    Write-Host "     - Use Personal Access Token" -ForegroundColor White
    Write-Host "     - Configure Git credentials" -ForegroundColor White
    Write-Host "  2. Check your internet connection" -ForegroundColor Yellow
    Write-Host "  3. Verify repository permissions" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan

