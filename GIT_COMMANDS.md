# 🚀 Git Commands for Deployment

## ⚡ Copy & Paste These Commands

### Option 1: Deploy with Commit
```bash
cd "C:\Users\adria\Desktop\huelva-tourism"
git add .
git commit -m "Fix: Enable ES6 modules and Render deployment"
git push origin main
```

### Option 2: Deploy with Description
```bash
cd "C:\Users\adria\Desktop\huelva-tourism"
git add .
git commit -m "Fix: Enable ES6 modules and Render deployment

- Change main.min.js to main.js with type='module'
- Change styles.min.css to styles.css
- Update build-production.js for ES6 modules
- Add render.yaml configuration
- Add test-render-locally.js for local testing"
git push origin main
```

---

## 📋 Verify Before Pushing

```bash
# Check what files changed
git status

# See the changes
git diff

# See which files will be added
git diff --cached
```

---

## ✅ After Push

Once GitHub shows the changes:
1. Go to https://dashboard.render.com
2. Your service should auto-deploy OR click "Manual Deploy"
3. Wait 2-3 minutes for deployment
4. Visit your Render URL to verify

---

## 🔍 Troubleshooting Git

**If you made a mistake:**
```bash
# Undo last commit (keeps changes)
git reset --soft HEAD~1

# Undo all changes to a file
git checkout -- filename

# See commit history
git log --oneline -10
```

---

## 📝 Files Changed Summary
- `index.html` - Changed to use ES6 module
- `about-us.html` - Changed to use ES6 module  
- `build-production.js` - Improved for ES6
- `package.json` - Added test-render script
- `render.yaml` - NEW configuration
- `.renderignore` - NEW ignore file
- `test-render-locally.js` - NEW test script

Total: 3 modified, 3 new files
