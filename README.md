# 🌍 Come2Huelva - Tourism Website

> Premium tourism website showcasing authentic experiences in Huelva, Spain

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)](package.json)
[![Production Ready](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)]()

## 📖 About

Come2Huelva is a premium tourism website created by local guides Javier and Laura, showcasing the most iconic sites, cuisine, and activities in Huelva, Andalusia. The website offers:

- 🏞️ **Local Tours**: Doñana National Park, El Rocío, Costa de la Luz, and more
- 🎯 **Authentic Experiences**: Fishing, horseback riding, stargazing, cooking classes
- 🍷 **Gastronomy**: Iberian meats, fresh seafood, local wines, and berries
- 🗺️ **Custom Journeys**: Personalized travel experiences with local guides
- 🌐 **Multilingual**: Spanish, English, and French

## ✨ Features

- **Premium Design**: Clean, elegant, luxury travel aesthetic
- **Fully Responsive**: Optimized for mobile, tablet, and desktop
- **SEO Optimized**: Complete meta tags, structured data, sitemap
- **Accessible**: WCAG 2.1 Level AA compliant
- **Performance**: Fast loading with lazy images and optimized animations
- **Multilingual**: Complete translations for ES, EN, FR
- **Interactive**: Smooth carousels, scroll animations, contact form

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/huelva-tourism.git
   cd huelva-tourism
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local server**
   ```bash
   npm start
   ```
   Visit: `http://localhost:8080`

### Project Structure

```
huelva-tourism/
├── index.html              # Main page
├── about-us.html           # About us page
├── main.js                 # Application logic
├── styles.css              # All styles
├── robots.txt              # Search engine instructions
├── sitemap.xml             # Site map for SEO
├── images/                 # Image assets
├── video/                  # Video assets
└── back-end/               # Email service
    └── server.js           # Node.js email server
```

## 🛠️ Development

### Available Scripts

```bash
# Start local development server
npm start

# Optimize all images (requires sharp)
npm run optimize:images

# Minify CSS
npm run minify:css

# Minify JavaScript
npm run minify:js

# Full build (optimize + minify)
npm run build

# Validate JavaScript syntax
npm run validate
```

### Backend Setup

The contact form requires a backend service:

1. Navigate to backend folder:
   ```bash
   cd back-end
   npm install
   ```

2. Configure email credentials (see back-end/README)

3. Start backend server:
   ```bash
   npm start
   ```

4. Update API endpoint in `main.js` (line 14):
   ```javascript
   EMAIL_ENDPOINT: 'https://www.come2huelva.com/api/send-email'
   ```

## 📦 Production Build

### Before Deployment

1. **Update Configuration**
   - Change API endpoint in `main.js` (line 14)
   - Update domain in meta tags if needed

2. **Optimize Assets** (Recommended)
   ```bash
   npm install
   npm run optimize:images
   npm run build
   ```

3. **Test Thoroughly**
   - All pages load correctly
   - Navigation works
   - Language switcher works
   - All carousels function
   - Contact form submits
   - Responsive on all devices

### Deployment Options

#### Option 1: Static Hosting (Netlify, Vercel)
```bash
# Install CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Option 2: Traditional Hosting (cPanel, FTP)
- Upload all files to `/public_html` or `/www`
- Ensure backend is configured separately
- Set up SSL certificate

#### Option 3: Cloud Hosting (AWS, Google Cloud)
- Use S3 + CloudFront (AWS)
- Use Cloud Storage + CDN (Google)
- Configure backend as serverless function

## 🎨 Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: ES6+, no frameworks
- **Node.js**: Backend email service
- **Bootstrap Icons**: Icon library
- **Google Fonts**: Cormorant Garamond, Source Sans Pro

## 🔍 SEO Features

- ✅ Semantic HTML5 structure
- ✅ Meta tags (title, description)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Structured data (LocalBusiness, TouristTrip)
- ✅ robots.txt
- ✅ sitemap.xml
- ✅ Canonical URLs
- ✅ hreflang tags (multilingual)
- ✅ Image alt attributes
- ✅ Descriptive URLs

## ♿ Accessibility

- ✅ WCAG 2.1 Level AA compliant
- ✅ Keyboard navigation support
- ✅ ARIA labels and landmarks
- ✅ Skip to content link
- ✅ Focus indicators
- ✅ Color contrast compliant
- ✅ Screen reader friendly

## 📱 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Mobile Safari | iOS 14+ | ✅ Full support |
| Chrome Android | Latest | ✅ Full support |

## 🐛 Known Issues

None! All major issues have been resolved.

## 📝 Changelog

### Version 2.0.0 (October 2025)
- Complete redesign with premium aesthetic
- Refactored JavaScript for better performance
- SEO optimization (robots.txt, sitemap, structured data)
- Enhanced accessibility
- Improved responsive design
- Added multilingual support (ES, EN, FR)
- Performance optimizations
- Production-ready codebase

### Version 1.0.0
- Initial release

## 🤝 Contributing

This is a private project, but suggestions are welcome.

## 📄 License

ISC © 2025 Adrián Ortiz Suárez

## 👥 Authors

- **Javier & Laura** - Tour Guides & Content
- **Adrián Ortiz Suárez** - Web Development

## 📞 Contact

- **Website**: [www.come2huelva.com](https://www.come2huelva.com)
- **Facebook**: [@come2huelva](https://www.facebook.com/come2huelva)
- **Instagram**: [@come2huelva](https://www.instagram.com/come2huelva/)

## 🙏 Acknowledgments

- Google Fonts for typography
- Bootstrap Icons for iconography
- The Huelva tourism community

---

**Built with ❤️ in Huelva, Andalusia, Spain**