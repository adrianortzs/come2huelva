# 🧪 Testing Guide - Come2Huelva

## Pre-Deployment Testing Checklist

### 🖥️ Desktop Testing (1920x1080)

#### Navigation
- [ ] Logo clickable and links to home
- [ ] All navigation links work correctly
- [ ] Active page highlighted
- [ ] Language selector opens/closes
- [ ] Language switching updates all text
- [ ] Language preference persists on refresh
- [ ] "Reservar tu tour" button scrolls to form
- [ ] Smooth scroll behavior works

#### Content Sections
- [ ] All images load correctly
- [ ] Image lazy loading works (check DevTools Network)
- [ ] All text is readable and properly formatted
- [ ] Headings hierarchy is correct
- [ ] Scroll reveal animations trigger correctly
- [ ] Video plays correctly

#### Carousels
- [ ] Activities carousel: navigation buttons work
- [ ] Gastronomy carousel: navigation buttons work
- [ ] Plans carousel: navigation buttons work
- [ ] Opinions carousel: navigation buttons work
- [ ] Auto-scroll works on all carousels
- [ ] Pause on hover works
- [ ] Resume after interaction works
- [ ] Smooth slide transitions

#### Contact Form
- [ ] All fields are editable
- [ ] Form validation works (try empty submit)
- [ ] Email validation works (try invalid email)
- [ ] Success message appears after submit
- [ ] Form resets after successful submit
- [ ] Error handling works (disable backend and test)

#### Footer
- [ ] Social media links work (open in new tab)
- [ ] Footer CTA button shows correct text
- [ ] Footer CTA button links correctly

---

### 📱 Tablet Testing (768px - 1024px)

#### Layout
- [ ] All sections scale properly
- [ ] Images fit within containers
- [ ] Text remains readable
- [ ] Proper spacing maintained
- [ ] No horizontal scroll

#### Navigation
- [ ] Hamburger menu appears
- [ ] Menu opens smoothly
- [ ] Menu closes when clicking link
- [ ] Menu closes when clicking outside
- [ ] Menu closes on Escape key
- [ ] Hamburger icon hides when menu open
- [ ] Menu pills styled correctly

#### Carousels
- [ ] Carousel buttons positioned correctly
- [ ] All carousels show appropriate number of slides
- [ ] Navigation works smoothly
- [ ] No overflow issues

#### Forms
- [ ] Touch targets large enough (44x44px minimum)
- [ ] Form inputs work with on-screen keyboard
- [ ] Submit button accessible

---

### 📱 Mobile Testing (320px - 767px)

#### Layout
- [ ] All content fits within viewport
- [ ] No horizontal scroll
- [ ] Touch targets large enough
- [ ] Text readable without zooming
- [ ] Images scale appropriately
- [ ] Proper spacing on small screens

#### Navigation
- [ ] Hamburger menu works
- [ ] Menu items easy to tap
- [ ] Language selector works
- [ ] Smooth scrolling works

#### Places Section
- [ ] Place cards centered
- [ ] Images fill containers
- [ ] Overlay text readable
- [ ] Proper spacing around cards

#### Carousels
- [ ] Buttons positioned at 1rem from edges
- [ ] Slides scroll smoothly
- [ ] Touch swipe works (if implemented)
- [ ] No overlap with content

#### Contact Form
- [ ] Form fields large enough
- [ ] Keyboard doesn't cover input
- [ ] Submit button accessible
- [ ] Error messages visible

#### Very Small Devices (320px - 450px)
- [ ] All content visible
- [ ] Carousel buttons not too close to cards
- [ ] Place images responsive
- [ ] Text size appropriate

---

### 🌐 Language Testing

#### Spanish (Default)
- [ ] All navigation in Spanish
- [ ] All content in Spanish
- [ ] Form labels in Spanish
- [ ] CTA buttons in Spanish
- [ ] Footer buttons correct for each page

#### English
- [ ] Language switches completely
- [ ] No missing translations
- [ ] All sections updated
- [ ] Grammar and spelling correct
- [ ] CTA buttons in English

#### French
- [ ] Language switches completely
- [ ] No missing translations
- [ ] All sections updated
- [ ] Grammar and spelling correct
- [ ] CTA buttons in French

#### Persistence
- [ ] Selected language saved
- [ ] Language persists on page reload
- [ ] Language persists when navigating pages

---

### 🔗 Link Testing

#### Internal Links
- [ ] index.html#places → Places section
- [ ] index.html#activities → Activities section
- [ ] index.html#gastronomy → Gastronomy section
- [ ] index.html#plans → Plans section
- [ ] about-us.html → About page
- [ ] All links from about-us.html back to index.html

#### External Links
- [ ] Facebook link → Opens in new tab
- [ ] Instagram link → Opens in new tab
- [ ] Links have rel="noopener noreferrer"

#### Anchor Links
- [ ] Scroll to correct section
- [ ] Header doesn't cover content (scroll-padding)
- [ ] Smooth scroll animation

---

### 🎨 Visual Testing

#### Design Consistency
- [ ] Colors consistent with brand
- [ ] Typography consistent throughout
- [ ] Spacing consistent
- [ ] Border radius consistent
- [ ] Shadows consistent

#### Animations
- [ ] Scroll reveal smooth
- [ ] Button hover effects smooth
- [ ] Carousel transitions smooth
- [ ] Menu open/close smooth
- [ ] No janky animations

#### Responsive Images
- [ ] No pixelated images
- [ ] No stretched images
- [ ] Proper aspect ratios
- [ ] Images load progressively

---

### ⚡ Performance Testing

#### Load Time
- [ ] Page loads in < 3 seconds (normal connection)
- [ ] Page loads in < 5 seconds (slow 3G)
- [ ] Images load progressively
- [ ] No render-blocking resources

#### Lighthouse Audit
Run in Chrome DevTools:
- [ ] Performance score > 85
- [ ] Accessibility score > 95
- [ ] Best Practices score > 90
- [ ] SEO score = 100

#### Network
- [ ] Images lazy load below fold
- [ ] Only necessary resources load initially
- [ ] No failed requests in console
- [ ] Fonts load correctly

---

### ♿ Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus visible on all elements
- [ ] Skip link works (Tab first thing)
- [ ] Can open/close menus with keyboard
- [ ] Can submit form with Enter
- [ ] Escape closes menus

#### Screen Reader (NVDA, JAWS, VoiceOver)
- [ ] All images have meaningful alt text
- [ ] Headings read in correct order
- [ ] Navigation landmarks announced
- [ ] Form labels announced
- [ ] Buttons have clear labels
- [ ] ARIA attributes working

#### Color Contrast
- [ ] Text readable in all color combinations
- [ ] Links distinguishable
- [ ] Focus indicators visible
- [ ] Meets WCAG AA standard (4.5:1)

---

### 🌍 Cross-Browser Testing

#### Chrome
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

#### Firefox
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

#### Safari
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors
- [ ] Backdrop-filter works

#### Edge
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

#### Mobile Safari (iOS)
- [ ] Touch events work
- [ ] No zoom on input focus
- [ ] Smooth scrolling works
- [ ] All features functional

#### Chrome Mobile (Android)
- [ ] Touch events work
- [ ] All features functional
- [ ] Performance good

---

### 🔍 SEO Testing

#### Meta Tags
- [ ] Title unique per page
- [ ] Description under 160 characters
- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] Canonical URL correct

#### Structured Data
- [ ] Validate with Google Rich Results Test
- [ ] LocalBusiness schema valid
- [ ] TouristTrip schema valid

#### Sitemap & Robots
- [ ] sitemap.xml accessible
- [ ] robots.txt accessible
- [ ] URLs in sitemap correct

#### Google Search Console (After Deploy)
- [ ] Submit sitemap
- [ ] Verify ownership
- [ ] Check indexing status
- [ ] Review search analytics

---

### 🔒 Security Testing

#### Form Security
- [ ] Form doesn't submit without validation
- [ ] Email validation prevents XSS
- [ ] Backend validates inputs
- [ ] Rate limiting prevents spam

#### HTTPS (After SSL Setup)
- [ ] All resources load over HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate valid
- [ ] Auto-redirect to HTTPS

---

### 📊 Analytics Testing (After Setup)

#### Google Analytics
- [ ] Tracking code present
- [ ] Page views recorded
- [ ] Events tracked (form submit, etc.)
- [ ] Real-time data showing

---

## 🐛 Common Issues & Fixes

### Issue: Carousel buttons not visible
**Check**: CSS media query for current viewport
**Fix**: Verify button positioning in styles.css

### Issue: Language not switching
**Check**: Browser console for errors
**Fix**: Verify translations object in main.js

### Issue: Form not submitting
**Check**: Backend server running
**Fix**: Start back-end server or update endpoint

### Issue: Images not loading
**Check**: File paths and capitalization
**Fix**: Verify image file names match HTML

### Issue: Horizontal scroll on mobile
**Check**: Elements wider than viewport
**Fix**: Review width values in mobile media queries

---

## ✅ Sign-Off Checklist

### Development
- [ ] All features tested
- [ ] No console errors
- [ ] Code reviewed
- [ ] Documentation complete

### Content
- [ ] All text proofread
- [ ] All images approved
- [ ] Translations verified
- [ ] Links verified

### Performance
- [ ] Lighthouse audit passed
- [ ] Load time acceptable
- [ ] Images optimized
- [ ] Code minified

### SEO & Accessibility
- [ ] Meta tags complete
- [ ] Alt text on all images
- [ ] WCAG compliance verified
- [ ] Sitemap submitted

### Final
- [ ] Tested on 3+ browsers
- [ ] Tested on 3+ devices
- [ ] Backup created
- [ ] Ready to deploy ✅

---

## 🎯 Testing Priority

### Must Test (Critical)
1. Navigation menu (mobile & desktop)
2. Language switcher
3. Contact form submission
4. All page links

### Should Test (Important)
1. All carousels
2. Responsive layouts
3. Cross-browser compatibility
4. Performance metrics

### Nice to Test (Optional)
1. Slow network conditions
2. Screen readers
3. High DPI displays
4. Print styles

---

**Testing Completion**: _____ / 100 items  
**Tester**: _____________  
**Date**: _____________  
**Status**: [ ] PASS [ ] FAIL [ ] NEEDS WORK

---

*Document Version*: 1.0  
*Last Updated*: October 2025

