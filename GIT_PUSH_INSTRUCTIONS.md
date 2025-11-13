# Git Push Instructions

## Quick Push (Automated)

### Option 1: Run the PowerShell Script
```powershell
powershell -ExecutionPolicy Bypass -File .\auto-push-github.ps1
```

### Option 2: Run the Batch File
```cmd
push.bat
```

## Manual Push (Step by Step)

If the automated scripts don't work, follow these steps:

### 1. Navigate to Project Directory
```bash
cd d:\stch\brain-insight-dash-main
```

### 2. Initialize Git (if not already done)
```bash
git init
git branch -M main
```

### 3. Add Remote Repository
```bash
git remote add origin https://github.com/abhiraj78907/neuroLink.git
```

If remote already exists:
```bash
git remote set-url origin https://github.com/abhiraj78907/neuroLink.git
```

### 4. Stage All Files
```bash
git add .
```

### 5. Commit Changes
```bash
git commit -m "NEUROCARE: Complete integration with Firebase, Firestore, and Gemini AI - Removed Lovable branding"
```

### 6. Push to GitHub
```bash
git push -u origin main --force
```

## Authentication

If you're prompted for credentials:

### Option 1: GitHub CLI (Recommended)
```bash
gh auth login
git push -u origin main
```

### Option 2: Personal Access Token
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic) with `repo` scope
3. Use token as password when prompted
4. Username: your GitHub username

### Option 3: SSH Key
```bash
git remote set-url origin git@github.com:abhiraj78907/neuroLink.git
git push -u origin main
```

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/abhiraj78907/neuroLink.git
```

### Error: "Authentication failed"
- Use GitHub CLI: `gh auth login`
- Or use Personal Access Token
- Or set up SSH keys

### Error: "Updates were rejected"
```bash
git push -u origin main --force
```

### Check Status
```bash
git status
git remote -v
git log --oneline -5
```

## Repository URL
https://github.com/abhiraj78907/neuroLink

