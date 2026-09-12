# GitHub Upload Troubleshooting Guide

## 🎯 Quick Fix Steps

Agar GitHub pe upload nahi ho raha, ye steps follow karein:

### Step 1: Git Status Check Karein

```bash
git status
```

Ye aapko batayega ki:
- Kaunsi files modified hain
- Kaunsi files untracked hain
- Kaunsi files staged hain

### Step 2: .gitignore Verify Karein

```bash
cat .gitignore
```

Ensure karein ki ye sab ignore ho raha hai:
- ✅ node_modules/
- ✅ dist/
- ✅ .env (NOT .env.example)
- ✅ *.log

### Step 3: Large Files Check Karein

```bash
# Check if any large files are being tracked
git ls-files | xargs -I {} sh -c 'echo "{} $(stat -f%z "{}" 2>/dev/null || stat -c%s "{}" 2>/dev/null)"' | sort -k2 -n | tail -20
```

Agar koi file 50MB se badi hai, toh usse remove karein.

### Step 4: Common Commands

```bash
# Sab changes add karein
git add .

# Commit karein
git commit -m "Fix: Resolve GitHub upload issues"

# Push karein
git push origin main
```

---

## 🔍 Specific Error Solutions

### Error: "Everything up-to-date"

**Matlab:** Koi changes nahi hain commit karne ke liye

**Solution:**
```bash
# Check karein ki changes hain ya nahi
git status

# Agar changes hain toh
git add .
git commit -m "Your message"
git push
```

### Error: "failed to push some refs"

**Matlab:** Remote mein changes hain jo aapke local se different hain

**Solution:**
```bash
# Pehle pull karein
git pull origin main --rebase

# Phir push karein
git push origin main
```

### Error: "src refspec main does not match any"

**Matlab:** Branch name issue hai

**Solution:**
```bash
# Current branch check karein
git branch

# Agar main nahi hai toh
git branch -M main
git push -u origin main
```

### Error: "Authentication failed"

**Matlab:** GitHub credentials galat hain

**Solution:**

**HTTPS ke liye:**
```bash
# Token generate karein GitHub se
# Settings → Developer settings → Personal access tokens

# Phir push karein, password ki jagah token use karein
git push
```

**SSH ke liye:**
```bash
# SSH key check karein
ssh -T git@github.com

# Agar error aaye toh
ssh-add ~/.ssh/id_ed25519
```

### Error: "Permission denied (publickey)"

**Matlab:** SSH key setup nahi hai

**Solution:**
```bash
# SSH key generate karein
ssh-keygen -t ed25519 -C "your.email@example.com"

# Key add karein
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Public key copy karein
cat ~/.ssh/id_ed25519.pub

# GitHub pe add karein:
# Settings → SSH and GPG keys → New SSH key
```

### Error: "Updates were rejected because the remote contains work"

**Matlab:** Remote branch mein commits hain jo aapke paas nahi hain

**Solution:**
```bash
# Pull karein
git pull origin main

# Conflicts resolve karein (if any)
git add .
git commit -m "Merge remote changes"
git push
```

---

## 🚨 Emergency Fixes

### Problem: Wrong files committed (node_modules, .env, etc.)

**Solution:**
```bash
# 1. Files ko git se remove karein (local files delete nahi hongi)
git rm -r --cached node_modules
git rm -r --cached dist
git rm --cached .env

# 2. Commit karein
git commit -m "Remove sensitive/large files from tracking"

# 3. Push karein
git push
```

### Problem: Commit history galat hai

**Solution:**
```bash
# Last 3 commits dekhein
git log --oneline -3

# Agar reset karna hai toh
git reset --soft HEAD~1  # Last commit undo, changes keep
git reset --hard HEAD~1  # Last commit undo, changes discard

# WARNING: --hard se changes delete ho jayenge!
```

### Problem: Branch galat hai

**Solution:**
```bash
# Current branch
git branch

# Main branch pe switch
git checkout main

# Ya naya branch banayein
git checkout -b fix/upload-issue
```

---

## 📋 Pre-Upload Checklist

Push karne se pehle ye sab check karein:

```bash
# 1. Build test
npm run build

# 2. Type check
npm run typecheck

# 3. Git status
git status

# 4. Check for large files
du -ah . | sort -n -r | head -n 20

# 5. Check .gitignore
cat .gitignore

# 6. Check for sensitive files
git ls-files | grep -E "\.env$|password|secret|key"
```

---

## 🔄 Complete Reset (Last Resort)

Agar sab kuch galat ho gaya hai:

```bash
# WARNING: Ye sab local changes delete kar dega!

# 1. Backup lein (optional)
cp -r . ../Fashion-2-Gether-backup

# 2. Git reset
git reset --hard origin/main

# 3. Clean untracked files
git clean -fd

# 4. Pull latest
git pull origin main

# 5. Reinstall
npm install

# 6. Test
npm run build
```

---

## 📞 Quick Diagnostic

Ye commands run karein aur output dekhein:

```bash
echo "=== Git Version ==="
git --version

echo -e "\n=== Current Branch ==="
git branch

echo -e "\n=== Remote URL ==="
git remote -v

echo -e "\n=== Git Status ==="
git status

echo -e "\n=== Last 5 Commits ==="
git log --oneline -5

echo -e "\n=== .gitignore Check ==="
grep -E "node_modules|dist|\.env" .gitignore

echo -e "\n=== Large Files Check ==="
du -ah . 2>/dev/null | sort -n -r | head -n 10 | grep -v "node_modules"
```

Is output ko dekhke main exactly bata sakta hoon ki kya issue hai!

---

## 🎯 Most Likely Solutions

90% cases mein ye 3 solutions kaam karte hain:

### Solution 1: Simple Push
```bash
git add .
git commit -m "Update project"
git push origin main
```

### Solution 2: Pull then Push
```bash
git pull origin main
git add .
git commit -m "Update project"
git push origin main
```

### Solution 3: Reset and Push
```bash
git reset --hard origin/main
git pull origin main
# Make your changes again
git add .
git commit -m "Update project"
git push origin main
```

---

## 🆘 Still Not Working?

Agar upar ke solutions kaam nahi kar rahe, toh:

1. **Error message copy karein** (pura error)
2. **Ye commands run karein:**
   ```bash
   git status
   git log --oneline -5
   git remote -v
   ```
3. **Output share karein** - main exact solution bata dunga

---

**Yaad rakhein:** GitHub pe upload na hone ke 3 main reasons hote hain:
1. Authentication issue (token/SSH key)
2. Large files (node_modules, dist)
3. Merge conflicts

99% cases mein ye guide se solve ho jayega! 🚀
