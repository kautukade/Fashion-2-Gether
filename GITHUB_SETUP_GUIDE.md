# GitHub Upload Guide - Fashion 2 Gether

## 🚀 Complete Setup Guide

Ye guide aapko step-by-step batayegi ki project ko GitHub pe kaise upload karein aur common issues ko kaise fix karein.

---

## 📋 Prerequisites

### 1. Git Install Karein

**Windows:**
```bash
# Download from: https://git-scm.com/download/win
# Install karein aur verify karein:
git --version
```

**Mac:**
```bash
# Homebrew se install karein:
brew install git

# Ya download karein: https://git-scm.com/download/mac
git --version
```

**Linux:**
```bash
sudo apt-get install git  # Ubuntu/Debian
sudo yum install git      # CentOS/RHEL
git --version
```

### 2. GitHub Account Banayein

1. [GitHub.com](https://github.com) pe jayein
2. "Sign up" pe click karein
3. Account create karein
4. Email verify karein

### 3. Git Configuration Setup

```bash
# Apna naam set karein
git config --global user.name "Your Name"

# Apna email set karein (GitHub wala email)
git config --global user.email "your.email@example.com"

# Verify karein
git config --global --list
```

---

## 🔐 GitHub Authentication Setup

### Method 1: SSH Key (Recommended)

#### Step 1: SSH Key Generate Karein

```bash
# Terminal/Git Bash mein run karein
ssh-keygen -t ed25519 -C "your.email@example.com"
```

Press Enter for all prompts (default locations accept karein).

#### Step 2: SSH Agent Start Karein

```bash
# Windows (Git Bash):
eval "$(ssh-agent -s)"

# Mac/Linux:
eval "$(ssh-agent -s)"
```

#### Step 3: SSH Key Add Karein

```bash
ssh-add ~/.ssh/id_ed25519
```

#### Step 4: Public Key Copy Karein

**Windows:**
```bash
cat ~/.ssh/id_ed25519.pub | clip
```

**Mac:**
```bash
cat ~/.ssh/id_ed25519.pub | pbcopy
```

**Linux:**
```bash
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard
```

#### Step 5: GitHub Pe Add Karein

1. GitHub pe login karein
2. Settings → SSH and GPG keys
3. "New SSH key" pe click karein
4. Title: "My Laptop" (ya koi bhi naam)
5. Key: Paste karein (jo copy kiya tha)
6. "Add SSH key" pe click karein

#### Step 6: Test Karein

```bash
ssh -T git@github.com
```

Aapko ye message dikhna chahiye:
```
Hi username! You've successfully authenticated...
```

### Method 2: HTTPS with Personal Access Token

#### Step 1: Token Generate Karein

1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. "Generate new token" → "Generate new token (classic)"
4. Note: "Fashion 2 Gether"
5. Expiration: 90 days (ya No expiration)
6. Scopes: Select `repo` (full control)
7. "Generate token" pe click karein
8. **Token copy karein** (ye sirf ek baar dikhega!)

#### Step 2: Token Use Karein

Jab bhi aap push/pull karein, password ki jagah ye token paste karein.

---

## 📦 Project Setup

### Step 1: Repository Clone Karein

```bash
# Agar already cloned hai toh skip karein
git clone https://github.com/kautukade/Fashion-2-Gether.git
cd Fashion-2-Gether
```

### Step 2: Dependencies Install Karein

```bash
npm install
```

### Step 3: Environment Variables Setup

```bash
# .env file banayein
cp .env.example .env

# .env file ko edit karein aur apni values dalein
# IMPORTANT: .env file ko NEVER commit karein!
```

### Step 4: Build Test Karein

```bash
npm run build
```

Agar build successful hai, toh sab theek hai!

---

## 🚀 GitHub Pe Push Karein

### Initial Setup (Agar naya repository hai)

```bash
# Git initialize karein (agar nahi hai)
git init

# Remote add karein
git remote add origin https://github.com/kautukade/Fashion-2-Gether.git

# Main branch pe switch karein
git branch -M main

# Sab files add karein
git add .

# Commit karein
git commit -m "Initial commit: Fashion 2 Gether e-commerce platform"

# Push karein
git push -u origin main
```

### Regular Updates

```bash
# Changes check karein
git status

# Changes add karein
git add .

# Commit karein with message
git commit -m "Your commit message here"

# Push karein
git push
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Permission denied (publickey)"

**Solution:**
```bash
# SSH agent start karein
eval "$(ssh-agent -s)"

# SSH key add karein
ssh-add ~/.ssh/id_ed25519

# Test karein
ssh -T git@github.com
```

### Issue 2: "Authentication failed"

**Solution:**
- Agar HTTPS use kar rahe hain, toh Personal Access Token use karein
- Password ki jagah token paste karein

### Issue 3: "Updates were rejected because the remote contains work"

**Solution:**
```bash
# Pehle pull karein
git pull origin main

# Phir push karein
git push
```

### Issue 4: Large Files Error

**Problem:** GitHub 100MB se badi files allow nahi karta

**Solution:**
```bash
# Check karein ki kya large files hain
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sort -n -k 3 | tail -10

# Agar node_modules ya dist commit ho gaya hai toh:
git rm -r --cached node_modules
git rm -r --cached dist
git commit -m "Remove large files"
git push
```

### Issue 5: ".env file commit ho gayi hai"

**Solution:**
```bash
# .env ko git se remove karein (file delete nahi hogi)
git rm --cached .env

# Commit karein
git commit -m "Remove .env file from tracking"

# Push karein
git push

# IMPORTANT: GitHub pe jaake token/keys change karein!
```

### Issue 6: "fatal: unable to access"

**Solution:**
```bash
# Git credential clear karein
git config --global --unset credential.helper

# Windows:
git config --global credential.helper manager

# Mac:
git config --global credential.helper osxkeychain

# Linux:
git config --global credential.helper cache
```

### Issue 7: Merge Conflicts

**Solution:**
```bash
# Conflict files ko open karein
# <<<<<<< HEAD aur ======= aur >>>>>>> branch_name dhundhein
# Manual resolve karein

# Phir:
git add .
git commit -m "Resolve merge conflicts"
git push
```

---

## 📝 Best Practices

### 1. Commit Messages

**Good:**
```bash
git commit -m "feat: add product variant management"
git commit -m "fix: correct inventory calculation"
git commit -m "docs: update README with deployment steps"
```

**Bad:**
```bash
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

### 2. Branch Strategy

```bash
# Feature branch banayein
git checkout -b feature/new-feature

# Kaam karein
git add .
git commit -m "feat: add new feature"

# Push karein
git push -u origin feature/new-feature

# GitHub pe PR banayein
```

### 3. Regular Pull

```bash
# Rozana kaam shuru karne se pehle
git pull origin main
```

### 4. Never Commit

❌ .env files (secrets)
❌ node_modules/
❌ dist/ or build/
❌ *.log files
❌ API keys, passwords
❌ Database credentials

✅ Source code
✅ Configuration files (without secrets)
✅ Documentation
✅ Migrations

---

## 🔧 Supabase Edge Functions Deploy

### Step 1: Supabase CLI Install

```bash
npm install -g supabase
```

### Step 2: Login

```bash
supabase login
```

Browser open hoga, login karein.

### Step 3: Link Project

```bash
supabase link --project-ref your-project-id
```

Project ID Supabase dashboard → Settings → General mein milega.

### Step 4: Deploy Functions

```bash
# Create order function
supabase functions deploy create-order

# Track order function
supabase functions deploy track-order
```

### Step 5: Verify

Supabase Dashboard → Edge Functions mein jaake check karein.

---

## 🌐 Netlify Deployment

### Step 1: Netlify Account

[Netlify.com](https://netlify.com) pe account banayein.

### Step 2: Connect GitHub

1. "Add new site" → "Import an existing project"
2. GitHub select karein
3. Repository select karein: `Fashion-2-Gether`
4. Authorize karein

### Step 3: Build Settings

```
Build command: npm run build
Publish directory: dist
```

### Step 4: Environment Variables

Site settings → Environment variables mein add karein:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 5: Deploy

"Deploy site" pe click karein.

First deployment 2-3 minutes lega.

---

## 📊 Git Commands Cheat Sheet

### Basic Commands

```bash
# Status check
git status

# Add all changes
git add .

# Add specific file
git add filename.tsx

# Commit
git commit -m "message"

# Push
git push

# Pull
git pull
```

### Branch Commands

```bash
# List branches
git branch

# Create branch
git checkout -b feature-name

# Switch branch
git checkout branch-name

# Delete branch
git branch -d branch-name

# Merge branch
git merge branch-name
```

### Undo Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo specific file
git checkout -- filename.tsx

# Remove file from git (keep locally)
git rm --cached filename
```

### Remote Commands

```bash
# View remotes
git remote -v

# Add remote
git remote add origin url

# Change remote URL
git remote set-url origin new-url

# Remove remote
git remote remove origin
```

---

## ✅ Pre-Push Checklist

Push karne se pehle ye check karein:

- [ ] `npm run build` successful hai
- [ ] `npm run typecheck` successful hai
- [ ] `.env` file commit nahi ho rahi
- [ ] `node_modules/` commit nahi ho raha
- [ ] `dist/` commit nahi ho raha
- [ ] Koi sensitive data commit nahi ho raha
- [ ] Commit message clear aur descriptive hai
- [ ] Sab changes test ho gaye hain

---

## 🆘 Getting Help

### Documentation

- [Git Official Docs](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)

### Common Resources

- [Oh Shit, Git!?!](https://ohshitgit.com/) - Git mistakes fix karne ke liye
- [GitHub Guides](https://guides.github.com) - Official guides
- [Learn Git Branching](https://learngitbranching.js.org/) - Visual git learning

---

## 🎯 Quick Start (TL;DR)

Agar aap jaldi mein hain, bas ye commands run karein:

```bash
# 1. Clone
git clone https://github.com/kautukade/Fashion-2-Gether.git
cd Fashion-2-Gether

# 2. Install
npm install

# 3. Setup env
cp .env.example .env
# Edit .env with your values

# 4. Test build
npm run build

# 5. Commit & Push
git add .
git commit -m "Update: Homepage redesign and bug fixes"
git push

# 6. Deploy Edge Functions (if needed)
supabase functions deploy create-order
supabase functions deploy track-order
```

---

## 📞 Support

Agar koi issue aa raha hai:

1. Error message copy karein
2. `git status` ka output dekhein
3. `git log --oneline -10` se recent commits dekhein
4. Issue create karein GitHub pe with details

---

**Happy Coding! 🚀**
