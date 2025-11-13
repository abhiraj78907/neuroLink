# Git Push Script for brain-insight-dash
Write-Host "=== Git Push Script for brain-insight-dash ===" -ForegroundColor Cyan

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if .git exists
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Check git status
Write-Host "`nChecking git status..." -ForegroundColor Cyan
git status --short

# Add all files
Write-Host "`nAdding all files..." -ForegroundColor Cyan
git add .

# Commit if there are changes
$status = git status --porcelain
if ($status) {
    Write-Host "`nCommitting changes..." -ForegroundColor Cyan
    git commit -m "Integrate Firebase Auth, Firestore, and Gemini AI for NEUROCARE

- Add real-time AI processing for facial recognition and speech analysis
- Implement Firebase authentication with role-based access
- Add demo accounts with automatic creation
- Integrate Firestore for data storage and real-time sync
- Add AI processing pipeline with upload and live stream support"
} else {
    Write-Host "`nNo changes to commit." -ForegroundColor Yellow
}

# Check for remote
$remote = git remote -v
if (-not $remote) {
    Write-Host "`n=== No remote repository configured ===" -ForegroundColor Yellow
    Write-Host "To push to GitHub/GitLab, run:" -ForegroundColor Cyan
    Write-Host "  git remote add origin <your-repo-url>" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
    Write-Host "`nOr if you already have a remote:" -ForegroundColor Cyan
    Write-Host "  git remote add origin <your-repo-url>" -ForegroundColor White
} else {
    Write-Host "`nRemote repositories:" -ForegroundColor Cyan
    git remote -v
    
    Write-Host "`nPushing to remote..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Successfully pushed to remote!" -ForegroundColor Green
    } else {
        Write-Host "`n✗ Push failed. Check the error above." -ForegroundColor Red
    }
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan

