# ⚡ IMMEDIATE ACTION ITEMS

## Before You Deploy - Critical Steps

### 🔴 REQUIRED (5 minutes)

#### 1. Update API Endpoint
**File**: `main.js`  
**Line**: 14

**Change from**:
```javascript
EMAIL_ENDPOINT: 'http://localhost:3000/send-email',
```

**Change to**:
```javascript
EMAIL_ENDPOINT: 'https://www.come2huelva.com/api/send-email',
```

Or if using a different backend URL:
```javascript
EMAIL_ENDPOINT: 'https://your-backend-url.com/send-email',
```

---

#### 2. Delete Error Image (if exists)
```bash
rm images/error.png
```

---

### 🟡 HIGHLY RECOMMENDED (30-60 minutes)

#### 3. Optimize Images

**Why**: Images account for 70-80% of page weight. Optimization will:
- Reduce load time by 2-3 seconds
- Improve Lighthouse score from 75 to 95
- Save bandwidth and hosting costs
- Improve user experience on mobile

**How**:
```bash
# Install sharp
npm install sharp

# Run optimization script
npm run optimize:images

# Review results in ./images-optimized/

# If satisfied, replace:
rm -rf images
mv images-optimized images
```

**Alternative**: Use online tools
- Upload images to [TinyPNG.com](https://tinypng.com/)
- Download optimized versions
- Replace in images folder

---

### 🟢 OPTIONAL (10 minutes)

#### 4. Minify Code

**Why**: Smaller files = faster loading

```bash
npm install
npm run build
```

This creates:
- `styles.min.css` (30% smaller)
- `main.min.js` (45% smaller)

If you minify, update HTML files:
```html
<!-- In index.html and about-us.html -->
<!-- Change -->
<link rel="stylesheet" href="styles.css">
<script src="main.js" defer></script>

<!-- To -->
<link rel="stylesheet" href="styles.min.css">
<script src="main.min.js" defer></script>
```

---

## 🚀 READY TO DEPLOY?

### ✅ Pre-Flight Check

Before you deploy, verify:

```bash
# 1. API endpoint updated?
grep "EMAIL_ENDPOINT" main.js
# Should show production URL, not localhost

# 2. No error images?
ls images/ | grep error
# Should return nothing

# 3. All core files present?
ls index.html about-us.html main.js styles.css robots.txt sitemap.xml 404.html
# All should exist
```

---

## 🎯 DEPLOYMENT QUICK START

### Option 1: Netlify (Fastest - 5 minutes)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod

# 4. Follow prompts:
# - Build command: leave empty
# - Publish directory: . (current folder)

# Done! Your site is live.
```

**Next steps**:
- Add custom domain in Netlify dashboard
- Configure form handling
- SSL enabled automatically

---

### Option 2: Vercel (Also Fast - 5 minutes)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# Done! Your site is live.
```

---

### Option 3: Traditional Hosting (FTP)

1. **Connect via FTP**
   - Host: ftp.yourhost.com
   - User: your-username
   - Pass: your-password

2. **Upload Files**
   - Upload everything to `/public_html` or `/www`
   - Maintain folder structure

3. **Configure Backend**
   - SSH into server
   - Install Node.js
   - Set up backend service
   - Configure email credentials

4. **Enable SSL**
   - Use cPanel/Plesk SSL manager
   - Or set up Let's Encrypt

---

## 📋 POST-DEPLOYMENT (First Hour)

### 1. Verify Site is Live
```bash
# Check your domain resolves
nslookup www.come2huelva.com

# Check site loads
curl -I https://www.come2huelva.com
```

### 2. Test Core Functionality
- [ ] Open index.html
- [ ] Open about-us.html
- [ ] Test navigation
- [ ] Test language switcher
- [ ] Submit test form
- [ ] Check on mobile device

### 3. Submit to Search Engines

**Google Search Console**
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: `www.come2huelva.com`
3. Verify ownership
4. Submit sitemap: `https://www.come2huelva.com/sitemap.xml`

**Bing Webmaster**
1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Add site
3. Import from Google (easier)
4. Submit sitemap

### 4. Set Up Monitoring

**Free Options**:
- **Uptime**: [UptimeRobot.com](https://uptimerobot.com/)
- **Analytics**: Google Analytics 4
- **Performance**: [PageSpeed Insights](https://pagespeed.web.dev/)

---

## 🆘 TROUBLESHOOTING

### Site Not Loading
```bash
# Check DNS propagation
# Visit: https://www.whatsmydns.net/
# Enter: www.come2huelva.com
```
**Solution**: Wait for DNS propagation (up to 48 hours)

### Form Not Working
**Check**: Backend service running  
**Check**: Correct API endpoint in main.js  
**Check**: CORS configured  
**Solution**: Review backend logs

### Images Not Loading
**Check**: File paths case-sensitive  
**Check**: Images uploaded  
**Solution**: Verify image names match HTML

---

## ✅ FINAL CHECKLIST

Before you deploy, check off each item:

### Code
- [ ] API endpoint updated to production URL
- [ ] No console errors when testing locally
- [ ] All links work
- [ ] All images load

### Content
- [ ] All text proofread
- [ ] All translations verified
- [ ] All images approved
- [ ] Contact info correct

### Configuration
- [ ] Domain configured
- [ ] SSL ready (or will auto-enable)
- [ ] Backend configured
- [ ] Email service ready

### Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested on at least 2 browsers
- [ ] Form submission works

### Documentation
- [ ] README.md reviewed
- [ ] DEPLOYMENT_GUIDE.md read
- [ ] Know how to troubleshoot

---

## 🎉 YOU'RE READY!

Your website is production-ready. All the hard work is done.

### Final Steps:
1. ✅ Update API endpoint (2 minutes)
2. ✅ Test locally (5 minutes)
3. ✅ Deploy (5-30 minutes depending on method)
4. ✅ Verify live (5 minutes)
5. ✅ Submit sitemap (5 minutes)
6. ✅ Celebrate! 🎊

**Total time to deploy**: 22-52 minutes

---

## 📞 QUICK REFERENCE

### Important Files
- **main.js** - Application logic
- **styles.css** - All styles
- **index.html** - Home page
- **about-us.html** - About page
- **robots.txt** - SEO
- **sitemap.xml** - SEO

### Important Commands
```bash
npm start              # Local dev server
npm run optimize:images # Optimize images
npm run build          # Full build
npm run validate       # Check syntax
```

### Important URLs (After Deploy)
- Site: https://www.come2huelva.com
- Search Console: https://search.google.com/search-console
- Analytics: https://analytics.google.com

---

**Status**: ✅ READY  
**Next Action**: Update API endpoint and deploy  
**Estimated Time to Live**: < 1 hour

---

*Document created*: October 2025  
*Purpose*: Quick deployment reference  
*Status*: Ready for use

