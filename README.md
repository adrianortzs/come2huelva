# 🌍 Come2Huelva - Premium Tourism Website

> **Portfolio Project** - A modern, multilingual tourism website showcasing advanced web development skills

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Come2Huelva-brightgreen.svg)](https://www.come2huelva.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)](package.json)
[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)]()

## 🎯 Project Overview

**Come2Huelva** is a premium tourism website built from scratch, demonstrating advanced frontend development skills. This project showcases modern web technologies, performance optimization, and user experience design for a real-world tourism business in Huelva, Spain.

### 🏆 Key Achievements
- **Performance**: 95+ Lighthouse score across all metrics
- **Accessibility**: WCAG 2.1 Level AA compliant
- **SEO**: Complete optimization with structured data
- **Multilingual**: Full i18n implementation (ES, EN, FR)
- **Mobile-First**: Responsive design for all devices

## 🚀 Technical Highlights

### **Frontend Architecture**
- **Vanilla JavaScript ES6+** - No frameworks, pure performance
- **Modular Architecture** - Clean separation of concerns
- **Service Worker** - PWA capabilities with offline support
- **Image Optimization** - WebP conversion and lazy loading
- **Advanced CSS** - Custom properties, Grid, Flexbox

### **Performance Optimizations**
- **Code Splitting** - Modular JavaScript architecture
- **Lazy Loading** - Images and content loading optimization
- **Minification** - Automated build process for production
- **Caching Strategy** - Service Worker implementation
- **Critical CSS** - Above-the-fold optimization

### **Development Workflow**
- **Build System** - Custom Node.js build pipeline
- **Source Maps** - Debugging support for production
- **Asset Optimization** - Automated image and code optimization
- **Quality Assurance** - ESLint, validation, and testing

## 🛠️ Technology Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript ES6+ |
| **Styling** | CSS Custom Properties, Grid, Flexbox, Animations |
| **Icons** | Bootstrap Icons |
| **Fonts** | Google Fonts (Cormorant Garamond, Source Sans Pro) |
| **Backend** | Node.js, Express.js |
| **Build Tools** | Custom Node.js scripts, npm |
| **Deployment** | Static hosting with CDN |

## 📁 Project Structure

```
huelva-tourism/
├── 📄 index.html              # Main page with semantic HTML5
├── 📄 about-us.html           # About page
├── 📄 404.html               # Custom error page
├── 🎨 styles.css             # Main stylesheet (35KB)
├── ⚡ main.js                 # Application logic (18KB)
├── 📦 js/                     # Modular JavaScript
│   ├── utils.js              # Utility functions
│   ├── translations.js       # i18n translations
│   └── imageOptimization.js  # Image optimization
├── 🖼️ images/                # Optimized image assets
├── 🎥 videos/                # Video content
├── 🔧 build-production.js    # Custom build system
├── 📋 manifest.json          # PWA manifest
├── 🤖 robots.txt             # SEO configuration
├── 🗺️ sitemap.xml            # Site structure
└── 🔒 .htaccess              # Server configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm 8+

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/yourusername/huelva-tourism.git
cd huelva-tourism

# Install dependencies
npm install

# Start development server
npm start
# Visit: http://localhost:8080
```

### Available Scripts

```bash
# Development
npm start                    # Local development server
npm run validate            # JavaScript syntax validation

# Production
npm run build               # Full production build
npm run minify             # Minify CSS and JS
```

## 🎨 Design & UX Features

### **Visual Design**
- **Premium Aesthetic** - Luxury travel industry standards
- **Color Psychology** - Warm, inviting color palette
- **Typography** - Carefully selected font combinations
- **Imagery** - High-quality, optimized photography

### **User Experience**
- **Intuitive Navigation** - Clear information architecture
- **Smooth Animations** - CSS transitions and scroll effects
- **Interactive Elements** - Carousels, forms, language switcher
- **Accessibility** - Full keyboard navigation and screen reader support

### **Responsive Design**
- **Mobile-First** - Optimized for mobile devices
- **Breakpoints** - Tablet and desktop adaptations
- **Touch-Friendly** - Appropriate touch targets and gestures

## 🔧 Advanced Features

### **Multilingual Support**
```javascript
// Complete i18n implementation
const translations = {
  es: { /* Spanish translations */ },
  en: { /* English translations */ },
  fr: { /* French translations */ }
};
```

### **Image Optimization**
```javascript
// Automatic WebP conversion and lazy loading
class ImageOptimizer {
  detectWebPSupport() { /* WebP detection */ }
  initLazyLoading() { /* Intersection Observer */ }
  preloadCriticalImages() { /* Critical resource hints */ }
}
```

### **Performance Monitoring**
```javascript
// Service Worker for caching and offline support
const CACHE_NAME = 'come2huelva-v1';
// Advanced caching strategies
```

## 📊 Performance Metrics

| Metric | Score | Details |
|--------|-------|---------|
| **Lighthouse Performance** | 95+ | Optimized loading and rendering |
| **First Contentful Paint** | < 1.5s | Critical CSS optimization |
| **Largest Contentful Paint** | < 2.5s | Image optimization |
| **Cumulative Layout Shift** | < 0.1 | Stable layout |
| **Time to Interactive** | < 3s | JavaScript optimization |

## 🔍 SEO Implementation

### **Technical SEO**
- ✅ Semantic HTML5 structure
- ✅ Meta tags and Open Graph
- ✅ Structured data (Schema.org)
- ✅ XML sitemap and robots.txt
- ✅ Canonical URLs and hreflang

### **Content SEO**
- ✅ Keyword optimization
- ✅ Local SEO (Huelva, Andalusia)
- ✅ Tourism industry focus
- ✅ Multilingual SEO

## ♿ Accessibility Features

- ✅ **WCAG 2.1 Level AA** compliant
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Screen Reader** - ARIA labels and landmarks
- ✅ **Color Contrast** - WCAG compliant ratios
- ✅ **Focus Management** - Clear focus indicators
- ✅ **Reduced Motion** - Respects user preferences

## 🌐 Browser Support

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Mobile Safari | iOS 14+ | ✅ Full support |

## 🚀 Deployment

### **Production Build**
```bash
# Generate production files
npm run build

# Output: dist/ folder with optimized assets
```

### **Deployment Options**
- **Static Hosting** - Netlify, Vercel, GitHub Pages
- **Traditional Hosting** - cPanel, FTP upload
- **Cloud Hosting** - AWS S3, Google Cloud Storage

## 📈 Business Impact

### **Client Results**
- **Professional Presence** - Modern, trustworthy website
- **Lead Generation** - Contact form with backend integration
- **SEO Visibility** - Improved search engine rankings
- **User Engagement** - Interactive features and smooth UX

### **Technical Achievements**
- **Code Quality** - Clean, maintainable, documented code
- **Performance** - Fast loading and smooth interactions
- **Scalability** - Modular architecture for future growth
- **Maintainability** - Well-organized, commented codebase

## 🎓 Learning Outcomes

This project demonstrates proficiency in:

- **Modern JavaScript** - ES6+, modules, async/await
- **CSS Architecture** - Custom properties, Grid, Flexbox
- **Performance Optimization** - Lazy loading, minification, caching
- **Accessibility** - WCAG guidelines, semantic HTML
- **SEO** - Technical and content optimization
- **Build Tools** - Custom Node.js build pipeline
- **PWA** - Service Workers, manifest, offline support

## 📝 Development Process

### **Planning Phase**
1. **Requirements Analysis** - Client needs and business goals
2. **Technical Architecture** - Technology stack decisions
3. **Design System** - Color palette, typography, components

### **Development Phase**
1. **HTML Structure** - Semantic, accessible markup
2. **CSS Implementation** - Mobile-first responsive design
3. **JavaScript Development** - Modular, performant code
4. **Testing & Optimization** - Cross-browser, performance testing

### **Production Phase**
1. **Build Optimization** - Minification, compression
2. **Deployment** - Production environment setup
3. **Monitoring** - Performance and error tracking

## 🤝 Contact & Collaboration

**Developer**: Adrián Ortiz Suárez  
**Email**: [your-email@example.com](mailto:your-email@example.com)  
**LinkedIn**: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)  
**GitHub**: [github.com/yourusername](https://github.com/yourusername)

## 📄 License

ISC © 2025 Adrián Ortiz Suárez

---

**Built with ❤️ and modern web technologies in Spain**

*This project showcases advanced frontend development skills and real-world application of modern web technologies.*