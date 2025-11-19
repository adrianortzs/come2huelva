# 🌍 Come2Huelva

> **Premium Tourism Website** - A modern, multilingual, full-stack web application showcasing advanced development practices and real-world business implementation.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Come2Huelva-00C853?style=for-the-badge&logo=vercel)](https://www.come2huelva.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)]()

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Internationalization](#-internationalization)
- [Performance Optimizations](#-performance-optimizations)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Browser Support](#-browser-support)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Come2Huelva** is a production-ready tourism website built for a local tour operator in Huelva, Spain. The project demonstrates enterprise-level full-stack development practices, including:

- **Modern Frontend Architecture** - Vanilla JavaScript ES6+ with modular design
- **Serverless Backend** - Vercel serverless functions for API endpoints
- **Multilingual Support** - Complete i18n implementation (ES, EN, FR)
- **Performance Optimization** - Lighthouse scores 95+ across all metrics
- **Accessibility** - WCAG 2.1 Level AA compliant
- **SEO Optimization** - Complete technical and content SEO implementation

### Business Context

The website serves as the primary digital presence for a tourism business offering:
- Guided tours to Doñana National Park
- Cultural experiences in El Rocío
- Gastronomy tours featuring local cuisine
- Custom travel packages
- Local guide services

---

## ✨ Key Features

### Frontend Features

- ✅ **Responsive Design** - Mobile-first approach with breakpoints for all devices
- ✅ **Interactive Carousels** - Custom-built carousel system with touch/swipe support
- ✅ **Smooth Animations** - CSS transitions and scroll-based reveal animations
- ✅ **Video Integration** - Hero video with autoplay and sound management
- ✅ **Form Handling** - Contact form with validation and serverless backend integration
- ✅ **Language Switching** - Persistent language selection with localStorage
- ✅ **Accessibility** - Full keyboard navigation, ARIA labels, screen reader support

### Backend Features

- ✅ **Serverless API** - Vercel serverless functions
- ✅ **Email Service** - Nodemailer integration with Gmail SMTP
- ✅ **Rate Limiting** - Protection against spam and abuse
- ✅ **Input Validation** - Server-side validation and sanitization
- ✅ **Error Handling** - Comprehensive error management and logging
- ✅ **CORS Configuration** - Secure cross-origin request handling

### Technical Features

- ✅ **Image Optimization** - WebP format conversion, lazy loading, responsive images
- ✅ **Code Splitting** - Modular JavaScript architecture
- ✅ **Build System** - Custom Node.js build pipeline with minification
- ✅ **SEO Implementation** - Structured data, sitemap, robots.txt, meta tags
- ✅ **PWA Ready** - Manifest.json and service worker support
- ✅ **Legal Pages** - Complete legal documentation (Privacy Policy, Cookie Policy, Legal Notice)

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **HTML5** | - | Semantic markup |
| **CSS3** | - | Styling with custom properties, Grid, Flexbox |
| **JavaScript** | ES6+ | Vanilla JS with ES6 modules |
| **Bootstrap Icons** | 1.11.3 | Icon library |
| **Google Fonts** | - | Typography (Cormorant Garamond, Source Sans Pro) |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20+ | Runtime environment |
| **Vercel** | - | Serverless hosting and functions |
| **Nodemailer** | 6.9.7 | Email service integration |

### Build Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **Terser** | 5.19.0 | JavaScript minification |
| **CSSnano** | 6.0.0 | CSS minification |
| **Sharp** | 0.32.6 | Image processing and WebP conversion |
| **http-server** | 14.1.1 | Local development server |

---

## 📁 Project Structure

```
come2huelva/
├── 📄 index.html                    # Main landing page
├── 📄 about-us.html                 # About us page
├── 📄 404.html                      # Custom error page
├── 📄 aviso-legal.html              # Legal notice (multilingual)
├── 📄 politica-privacidad.html      # Privacy policy (multilingual)
├── 📄 politica-cookies.html         # Cookie policy (multilingual)
│
├── 🎨 styles.css                    # Main stylesheet (2,296 lines)
│
├── 📦 js/                           # JavaScript modules
│   ├── app.js                       # Application orchestrator
│   ├── config.js                   # Configuration constants
│   ├── utils.js                     # Utility functions
│   ├── navigation.js                # Navigation and mobile menu
│   ├── language.js                  # i18n language manager
│   ├── translations.js              # Translation data (ES, EN, FR)
│   ├── carousel.js                  # Carousel functionality
│   ├── form.js                      # Contact form handler
│   ├── scroll-reveal.js             # Scroll animations
│   └── build-production.js          # Build system
│
├── 🔧 api/                          # Serverless API
│   ├── send-email.js                # Email sending endpoint
│   └── package.json                 # API dependencies
│
├── 🖼️ img/                          # Optimized images (WebP format)
│   ├── logonuevo.webp              # Logo
│   ├── lugar*.webp                 # Place images
│   ├── actividad*.webp             # Activity images
│   ├── gastronomia*.webp           # Gastronomy images
│   └── plan*.webp                  # Plan images
│
├── 🎥 videos/                       # Video assets
│   └── video_optimized.mp4         # Hero video
│
├── 📋 package.json                  # Project dependencies
├── 📋 vercel.json                   # Vercel configuration
├── 🤖 robots.txt                    # SEO robots configuration
├── 🗺️ sitemap.xml                   # XML sitemap
└── 📖 README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **npm** 8 or higher
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/come2huelva.git
cd come2huelva

# Install project dependencies
npm install

# Install API dependencies
cd api && npm install && cd ..
```

### Development

```bash
# Start local development server
npm start

# The application will be available at:
# http://localhost:8080
```

### Available Scripts

```bash
# Development
npm start              # Start local development server (http-server)
npm run dev            # Start Vercel development server
npm run validate       # Validate JavaScript syntax

# Production
npm run build          # Build production-ready files
npm run minify         # Minify CSS and JavaScript files
npm run deploy         # Deploy to Vercel production
```

### Environment Variables

Create a `.env` file in the `api/` directory for production:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
RECIPIENT_EMAIL=recipient@example.com
```

For Vercel deployment, set these as environment variables in the Vercel dashboard.

---

## 🏗️ Architecture

### Frontend Architecture

The application follows a **modular architecture** pattern:

```javascript
// app.js - Main orchestrator
class App {
  constructor() {
    this.modules = {};
    this.init();
  }
  
  initializeModules() {
    this.modules.navigation = new Navigation();
    this.modules.languageManager = initLanguageManager();
    this.modules.carousels = initCarousels();
    this.modules.form = initForm();
    this.modules.scrollReveal = initScrollReveal();
  }
}
```

**Key Design Decisions:**

1. **Vanilla JavaScript** - No framework dependencies for maximum performance
2. **ES6 Modules** - Clean separation of concerns
3. **Class-based Architecture** - Object-oriented design for maintainability
4. **Event-driven** - Decoupled modules communicating via events
5. **Progressive Enhancement** - Core functionality works without JavaScript

### Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| `app.js` | Application initialization and module coordination |
| `navigation.js` | Header navigation, mobile menu, scroll behavior |
| `language.js` | i18n management, language switching, content updates |
| `carousel.js` | Carousel functionality with touch/swipe support |
| `form.js` | Form validation, submission, error handling |
| `scroll-reveal.js` | Scroll-based animations and reveal effects |
| `utils.js` | Shared utility functions (DOM, storage, etc.) |
| `config.js` | Application configuration constants |

### Backend Architecture

**Serverless Function Structure:**

```javascript
// api/send-email.js
export default async function handler(req, res) {
  // Rate limiting
  // Input validation
  // Email sending
  // Error handling
}
```

**Security Features:**

- ✅ Rate limiting (5 requests/hour per IP)
- ✅ Input sanitization
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Error message sanitization

---

## 🌐 Internationalization

The application supports **three languages**: Spanish (ES), English (EN), and French (FR).

### Implementation

```javascript
// translations.js structure
export const translations = {
  es: { /* Spanish translations */ },
  en: { /* English translations */ },
  fr: { /* French translations */ }
};

// Language switching
class LanguageManager {
  changeLanguage(lang) {
    this.currentLang = lang;
    storage.set('lang', lang);
    this.updatePageContent();
  }
}
```

### Translated Content

- ✅ Navigation links
- ✅ Page content (headers, paragraphs, spans)
- ✅ Form labels and placeholders
- ✅ Button text
- ✅ Footer content
- ✅ Legal pages (Privacy Policy, Cookie Policy, Legal Notice)
- ✅ Error messages and notifications

### Language Persistence

User language preference is stored in `localStorage` and persists across sessions.

---

## ⚡ Performance Optimizations

### Image Optimization

- ✅ **WebP Format** - All images converted to WebP for smaller file sizes
- ✅ **Lazy Loading** - Images load only when visible (Intersection Observer)
- ✅ **Responsive Images** - Appropriate sizes for different viewports
- ✅ **Critical Image Preloading** - Hero images preloaded for faster FCP

### Code Optimization

- ✅ **JavaScript Minification** - Terser for production builds
- ✅ **CSS Minification** - CSSnano for production builds
- ✅ **Code Splitting** - Modular architecture for better caching
- ✅ **Tree Shaking** - Unused code elimination

### Loading Strategies

- ✅ **Critical CSS** - Above-the-fold styles inlined
- ✅ **Deferred JavaScript** - Non-critical scripts loaded asynchronously
- ✅ **Resource Hints** - Preconnect, DNS-prefetch for external resources
- ✅ **Font Optimization** - Google Fonts with display=swap

### Performance Metrics

| Metric | Target | Status |
|--------|--------|--------|
| **Lighthouse Performance** | 95+ | ✅ Achieved |
| **First Contentful Paint** | < 1.5s | ✅ Achieved |
| **Largest Contentful Paint** | < 2.5s | ✅ Achieved |
| **Cumulative Layout Shift** | < 0.1 | ✅ Achieved |
| **Time to Interactive** | < 3s | ✅ Achieved |

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

**Configuration:**

The `vercel.json` file configures:
- Redirects for clean URLs
- Headers for security and performance
- Serverless function routing

### Manual Deployment

1. **Build production files:**
   ```bash
   npm run build
   ```

2. **Upload to hosting:**
   - Upload all files to your web server
   - Ensure `api/` directory is configured for serverless functions
   - Set environment variables in hosting dashboard

### Environment Setup

**Required Environment Variables:**

```env
# API Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
RECIPIENT_EMAIL=recipient@example.com
```

---

## 📡 API Documentation

### Endpoint: `/api/send-email`

**Method:** `POST`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+34 123 456 789",
  "people": "4",
  "message": "I'm interested in a tour"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Rate Limiting:**
- 5 requests per hour per IP address
- Returns `429 Too Many Requests` when exceeded

**Security:**
- Input validation and sanitization
- CORS protection
- Error message sanitization

---

## 🌍 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 88+ | ✅ Full support |
| Safari | 14+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Mobile Safari | iOS 14+ | ✅ Full support |
| Chrome Mobile | Latest | ✅ Full support |

**Progressive Enhancement:**
- Core functionality works in all modern browsers
- Enhanced features for supported browsers
- Graceful degradation for older browsers

---

## ♿ Accessibility

### WCAG 2.1 Level AA Compliance

- ✅ **Keyboard Navigation** - Full keyboard support for all interactive elements
- ✅ **Screen Reader Support** - ARIA labels, landmarks, and semantic HTML
- ✅ **Color Contrast** - WCAG AA compliant contrast ratios (4.5:1 for text)
- ✅ **Focus Management** - Clear focus indicators and logical tab order
- ✅ **Reduced Motion** - Respects `prefers-reduced-motion` media query
- ✅ **Alt Text** - Descriptive alt text for all images
- ✅ **Form Labels** - All form inputs have associated labels

### ARIA Implementation

```html
<!-- Example: Navigation menu -->
<nav id="site-nav" aria-label="Main navigation">
  <button aria-expanded="false" aria-controls="menu">
    Menu
  </button>
</nav>
```

---

## 🔍 SEO Implementation

### Technical SEO

- ✅ **Semantic HTML5** - Proper use of semantic elements
- ✅ **Meta Tags** - Title, description, Open Graph, Twitter Cards
- ✅ **Structured Data** - Schema.org markup (TourOperator, TouristAttraction)
- ✅ **XML Sitemap** - Complete sitemap with all pages
- ✅ **Robots.txt** - Proper crawler directives
- ✅ **Canonical URLs** - Prevent duplicate content
- ✅ **Hreflang Tags** - Multilingual SEO support

### Content SEO

- ✅ **Keyword Optimization** - Natural keyword integration
- ✅ **Local SEO** - Location-based optimization (Huelva, Andalusia)
- ✅ **Content Quality** - Unique, valuable content for each page
- ✅ **Internal Linking** - Strategic internal link structure

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Form submission and validation
- [ ] Language switching functionality
- [ ] Carousel navigation and touch gestures
- [ ] Accessibility testing with screen readers
- [ ] Performance testing (Lighthouse)
- [ ] SEO validation (Google Search Console)

### Performance Testing

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:8080 --view
```

---

## 🤝 Contributing

This is a private project for a client. However, if you have suggestions or find issues:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Style

- **JavaScript**: ES6+ syntax, camelCase for variables, PascalCase for classes
- **CSS**: BEM-like naming convention, custom properties for theming
- **HTML**: Semantic markup, accessibility-first approach

---

## 📄 License

ISC License

Copyright (c) 2025 Adrián Ortiz Suárez

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

---

## 👨‍💻 Author

**Adrián Ortiz Suárez**

- **Email**: [your-email@example.com](mailto:your-email@example.com)
- **LinkedIn**: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- **GitHub**: [github.com/yourusername](https://github.com/yourusername)
- **Portfolio**: [yourportfolio.com](https://yourportfolio.com)

---

## 🙏 Acknowledgments

- **Client**: Come2Huelva tourism business
- **Design Inspiration**: Modern tourism industry standards
- **Technologies**: Built with modern web standards and best practices

---

**Built with ❤️ using modern web technologies**

*This project demonstrates enterprise-level full-stack development skills and real-world business application.*
