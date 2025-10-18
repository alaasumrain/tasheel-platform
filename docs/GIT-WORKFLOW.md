# Git + Netlify Workflow Guide

## 🎯 Core Principles

**GOLDEN RULE:** Never push directly to `main` during development. Main = production.

```
Local Development (FREE, unlimited)
    ↓
Feature Branch (FREE, unlimited local commits)
    ↓
Push to Remote Branch (FREE Netlify preview URL)
    ↓
Test Preview → Iterate → Test Again
    ↓
Merge to Main (15 Netlify credits - production deploy)
```

---

## 📋 Quick Reference Commands

### Starting New Work

```bash
# 1. Create feature branch from latest main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 2. Work locally (commit as often as you want - FREE)
git add .
git commit -m "feat: your changes"

# 3. Push to remote branch for testing (gets FREE preview URL)
git push -u origin feature/your-feature-name
```

### Testing with Netlify Branch Previews

```bash
# Push your branch to get a preview URL
git push origin feature/your-feature-name

# Netlify automatically creates: https://feature-your-feature-name--yoursite.netlify.app
# This is FREE and doesn't use production credits
```

### Updating Your Branch

```bash
# While on your feature branch
git add .
git commit -m "fix: update based on testing"
git push  # Updates the preview automatically
```

### Merging to Production

```bash
# Only when feature is COMPLETE and TESTED
git checkout main
git pull origin main
git merge feature/your-feature-name
git push origin main  # ⚠️ Costs 15 Netlify credits

# Clean up
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## 🌿 Branch Naming Convention

Use descriptive prefixes:

- `feature/` - New features (e.g., `feature/admin-dashboard`)
- `fix/` - Bug fixes (e.g., `fix/navbar-mobile-menu`)
- `refactor/` - Code refactoring (e.g., `refactor/api-client`)
- `content/` - Content updates (e.g., `content/homepage-copy`)
- `style/` - Styling changes (e.g., `style/button-colors`)

**Examples:**
```bash
git checkout -b feature/user-authentication
git checkout -b fix/broken-image-links
git checkout -b content/update-pricing-page
```

---

## 💰 Cost Optimization Strategy

### FREE Operations (Unlimited)
✅ Local commits (`git commit`)
✅ Branch creation (`git checkout -b`)
✅ Branch pushes (`git push origin feature/name`)
✅ Netlify branch preview deployments
✅ Local development (`npm run dev`)

### PAID Operations (15 credits each)
❌ Push to main (`git push origin main`)
❌ Production deployments

### Strategy
- **During Development:** Work on feature branches, push to remote branches for testing
- **Sprint End:** Batch 5-10 completed features, merge all to main at once
- **Result:** Instead of 10 deploys (150 credits), do 1 deploy (15 credits)

---

## 🔄 Common Workflows

### Workflow 1: Small Feature (1-2 hours)

```bash
# Start
git checkout -b feature/update-contact-form

# Work + test locally
npm run dev
# ... make changes ...
git add .
git commit -m "feat: add phone field to contact form"

# Test on Netlify preview
git push -u origin feature/update-contact-form
# Visit preview URL to test

# If good, merge to main
git checkout main
git merge feature/update-contact-form
git push origin main  # Production deploy (15 credits)
```

### Workflow 2: Large Feature (multi-day)

```bash
# Day 1: Start feature
git checkout -b feature/order-management

# Make progress
git add .
git commit -m "feat: add order list view"
git add .
git commit -m "feat: add order detail modal"

# Push to preview for client review
git push -u origin feature/order-management
# Share preview URL with client/team

# Day 2: Continue based on feedback
git add .
git commit -m "fix: adjust modal layout per feedback"
git push  # Updates preview

# Day 3: Feature complete
# Test thoroughly on preview
# When ready:
git checkout main
git merge feature/order-management
git push origin main  # Production deploy (15 credits)
```

### Workflow 3: Sprint Planning (Best for Cost)

```bash
# Week 1: Work on multiple features in parallel

# Feature A
git checkout -b feature/new-dashboard
# ... work ...
git push -u origin feature/new-dashboard
# Test on preview

# Feature B
git checkout main
git checkout -b feature/email-notifications
# ... work ...
git push -u origin feature/email-notifications
# Test on preview

# Feature C
git checkout main
git checkout -b fix/mobile-navigation
# ... work ...
git push -u origin fix/mobile-navigation
# Test on preview

# Week 2: Sprint complete, merge all at once
git checkout main

git merge feature/new-dashboard
git merge feature/email-notifications
git merge fix/mobile-navigation

git push origin main  # ONE deploy for 3 features (15 credits total!)
```

---

## 🚨 Emergency Hotfix Workflow

For critical production bugs:

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-name

# Fix the issue
git add .
git commit -m "hotfix: fix critical payment processing bug"

# Test locally first
npm run dev

# If urgent, push directly to main
git checkout main
git merge hotfix/critical-bug-name
git push origin main  # Production deploy (15 credits)

# If can wait, push to branch for testing
git push -u origin hotfix/critical-bug-name
# Test on preview first
```

---

## 📊 Current State Checking

### Before starting work
```bash
git status           # Check current branch and uncommitted changes
git branch -a        # List all branches
git log --oneline -5 # Recent commits
```

### Check what will be deployed
```bash
git diff main                    # What changed from main
git log main..feature/my-branch  # Commits not in main yet
```

---

## 🛡️ Safety Rules

1. **Always pull before creating a branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/new-thing
   ```

2. **Never force push to main**
   ```bash
   git push --force origin main  # ❌ NEVER DO THIS
   ```

3. **Commit often locally (it's free!)**
   - Small commits are better than large ones
   - Easier to revert if needed
   - Better commit history

4. **Test on branch previews before merging**
   - Share preview URLs with team/clients
   - Catch issues before production

5. **Batch production deploys**
   - Group completed features
   - Deploy once per sprint/week
   - Saves credits and reduces risk

---

## 🔧 Helper Scripts (package.json)

Add these to your `package.json`:

```json
{
  "scripts": {
    "branch:new": "git checkout main && git pull && git checkout -b",
    "branch:push": "git push -u origin $(git branch --show-current)",
    "branch:list": "git branch -a",
    "branch:clean": "git branch --merged | grep -v '\\*\\|main\\|master' | xargs -n 1 git branch -d",
    "deploy:preview": "git push origin $(git branch --show-current)",
    "deploy:prod": "git checkout main && git pull && git push origin main"
  }
}
```

Usage:
```bash
npm run branch:new feature/my-feature  # Create new branch
npm run branch:push                    # Push current branch (preview)
npm run branch:list                    # List all branches
npm run deploy:prod                    # Deploy to production (15 credits)
```

---

## 📈 Workflow Comparison

### ❌ Old Way (Expensive)
```
Make change → Commit → Push to main → Deploy (15 credits)
Make change → Commit → Push to main → Deploy (15 credits)
Make change → Commit → Push to main → Deploy (15 credits)
Total: 45 credits for 3 changes
```

### ✅ New Way (Efficient)
```
Make change → Commit locally (free)
Make change → Commit locally (free)
Make change → Commit locally (free)
Push to feature branch → Preview URL (free)
Test → Fix → Commit → Push (free)
Merge to main → Deploy (15 credits)
Total: 15 credits for 3+ changes
```

---

## 🎓 Learning Resources

- [Git Branching Basics](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell)
- [Netlify Branch Deploys](https://docs.netlify.com/site-deploys/overview/#branch-deploys)
- [Git Branch Strategies](https://www.atlassian.com/git/tutorials/comparing-workflows)

---

## 💡 Tips & Tricks

1. **Use descriptive commit messages**
   - Good: `feat: add user authentication with email verification`
   - Bad: `changes`, `update`, `fix stuff`

2. **Preview URLs are your friend**
   - Test mobile responsiveness
   - Share with non-technical stakeholders
   - QA testing before production

3. **Keep main stable**
   - Only merge tested, complete features
   - Main should always be deployable

4. **Clean up old branches**
   ```bash
   npm run branch:clean  # Delete merged branches
   ```

5. **Use .gitignore properly**
   - Don't commit `.env` files
   - Don't commit `node_modules/`
   - Don't commit build artifacts

---

## 🆘 Troubleshooting

### "I committed to main by accident"
```bash
# If not pushed yet
git reset --soft HEAD~1  # Uncommit, keep changes
git checkout -b feature/my-branch  # Move to new branch

# If already pushed
git revert HEAD  # Create revert commit
git push origin main
```

### "My branch is behind main"
```bash
git checkout feature/my-branch
git merge main  # Merge latest main into your branch
# Or
git rebase main  # Replay your commits on top of main
```

### "I need to switch branches but have uncommitted work"
```bash
git stash  # Save work temporarily
git checkout other-branch
# ... do stuff ...
git checkout original-branch
git stash pop  # Restore saved work
```

---

**Remember:** Local commits are free. Branch previews are free. Only production deploys cost credits. Plan accordingly!
