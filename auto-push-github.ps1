# Automatic Git Push Script for NEUROCARE
# Repository: https://github.com/abhiraj78907/neuroLink

$ErrorActionPreference = "Stop"
$repoUrl = "https://github.com/abhiraj78907/neuroLink.git"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NEUROCARE - Auto Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version 2>&1
    Write-Host "[✓] Git found: $gitVersion" -ForegroundColor Green
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
    Write-Host "[✓] Git repository already exists" -ForegroundColor Green
}

# Configure remote
Write-Host "[!] Configuring remote repository..." -ForegroundColor Yellow
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    if ($existingRemote -ne $repoUrl) {
        Write-Host "[!] Updating remote URL..." -ForegroundColor Yellow
        git remote set-url origin $repoUrl
    }
    Write-Host "[✓] Remote configured: $repoUrl" -ForegroundColor Green
} else {
    git remote add origin $repoUrl
    Write-Host "[✓] Remote added: $repoUrl" -ForegroundColor Green
}

# Check git status
Write-Host ""
Write-Host "[!] Checking repository status..." -ForegroundColor Yellow
$status = git status --porcelain
$hasChanges = $status -ne $null -and $status.Length -gt 0

if ($hasChanges) {
    Write-Host "[!] Found changes to commit" -ForegroundColor Yellow
    
    # Add all files
    Write-Host "[!] Staging all files..." -ForegroundColor Yellow
    git add .
    Write-Host "[✓] All files staged" -ForegroundColor Green
    
    # Commit
    Write-Host "[!] Creating commit..." -ForegroundColor Yellow
    $commitMessage = @"
Initial commit: NEUROCARE - AI-Powered Alzheimer's Detection Platform

Features:
- Integrated Firebase Authentication with role-based access
- Implemented Firestore for real-time data storage
- Added Gemini AI integration for facial recognition and speech analysis
- Created AI processing pipeline with upload and live stream support
- Built comprehensive UI components for AI analysis
- Added demo accounts with automatic creation
- Removed Lovable branding, fully branded as NEUROCARE
- Modular, scalable architecture for future AI modalities
"@
    
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[✓] Changes committed successfully" -ForegroundColor Green
    } else {
        Write-Host "[✗] Commit failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[!] No changes to commit" -ForegroundColor Yellow
}

# Check if we need to pull first
Write-Host ""
Write-Host "[!] Checking remote status..." -ForegroundColor Yellow
try {
    git fetch origin main 2>&1 | Out-Null
    $localCommit = git rev-parse HEAD 2>$null
    $remoteCommit = git rev-parse origin/main 2>$null
    
    if ($remoteCommit -and $localCommit -ne $remoteCommit) {
        Write-Host "[!] Remote has changes. Pulling latest..." -ForegroundColor Yellow
        git pull origin main --rebase
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[!] Rebase failed, trying merge..." -ForegroundColor Yellow
            git pull origin main --no-rebase
        }
    }
} catch {
    Write-Host "[!] Remote branch may not exist yet (first push)" -ForegroundColor Yellow
}

# Push to remote
Write-Host ""
Write-Host "[!] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Repository: $repoUrl" -ForegroundColor Cyan
Write-Host ""

git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL: https://github.com/abhiraj78907/neuroLink" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "View your code at:" -ForegroundColor Yellow
    Write-Host "  https://github.com/abhiraj78907/neuroLink" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ✗ Push failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  1. Authentication required" -ForegroundColor White
    Write-Host "     - Use: gh auth login (GitHub CLI)" -ForegroundColor Gray
    Write-Host "     - Or: Configure Git credentials" -ForegroundColor Gray
    Write-Host "  2. Check your internet connection" -ForegroundColor White
    Write-Host "  3. Verify repository permissions" -ForegroundColor White
    Write-Host ""
    Write-Host "Try running manually:" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "Done!" -ForegroundColor Green

