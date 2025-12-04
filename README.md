# 🌍 Come2Huelva

> **Página web premium de turismo en Huelva** - Aplicación web moderna, multilingüe y full-stack que muestra prácticas avanzadas de desarrollo y una implementación empresarial real.

[![come2huelva](https://img.shields.io/badge/come2huelva-00C853?style=for-the-badge&logo=vercel)](https://www.come2huelva.com)

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Optimizaciones de Rendimiento](#-optimización)
- [Scripts Disponibles](#-scripts)
- [Internacionalización](#-internacionalización)
- [Seguridad](#-seguridad)
- [Despliegue](#-despliegue)
- [Licencia](#-licencia)

---

## 🎯 Descripción General

**Come2Huelva** es una página web multilingüe orientada a un operador turístico local. Combina una arquitectura frontend modular con funciones serverless para ofrecer contacto, internalización, formularios y un diseño profesional centrado en la experiencia de usuario.

---

## ✨ Características Principales

- **Responsive** (mobile first)
- **Carruseles Interactivos** con soporte touch/swipe
- **Animaciones en scroll**
- **Video hero optimizado**
- **Gestión de idioma** (ES / EN / FR)
- **Consentimiento de cookies**
- **Formulario de contacto** con validación y backend serverless (Nodemailer)
- **SEO avanzado** (sitemap, meta tags, schema, robots.txt)
- **Optimización de rendimiento** Webp, lazy loading, minificación, carga diferida, CSS crítico

---

## 🛠️ Stack Tecnológico

### Frontend

HTML5, CSS3, JavaScript ES6+, Google Fonts, Bootstrap Icons

### Backend

Node.js (funciones serverless en Vercel), Nodemailer

### Build

Terser, CSSnano, PostCSS

---

## 📁 Estructura del Proyecto

```
come2huelva/
├── 📄 index.html
├── 📄 sobre-nosotros.html
├── 📄 404.html
├── 📄 aviso-legal.html
├── 📄 politica-privacidad.html
├── 📄 politica-cookies.html
│
├── 🎨 styles.css
│
├── 📦 js/
│   ├── app.js
│   ├── config.js
│   ├── utils.js
│   ├── navigation.js
│   ├── language.js
│   ├── translations.js
│   ├── carousel.js
│   ├── form.js
│   ├── scroll-reveal.js
│   ├── cookies.js
│   ├── build-production.js
│
├── 🔧 api/
│   ├── send-email.js
│   └── package.json
│
├── 🖼️ img/
│   ├── logo.webp
│   ├── lugar*.webp
│   ├── actividad*.webp
│   ├── gastronomia*.webp
│   ├── plan*.webp
│   └── favicons
│
├── 🎥 video/
│   └── optimizado.mp4
│
├── 📋 package.json
├── 📋 vercel.json
├── 📋 .htaccess
├── 🤖 robots.txt
├── 🗺️ sitemap.xml
├── 📱 site.webmanifest
└── 📖 README.md
```

## 🏗️ Arquitectura

La aplicación sigue un patrón de **arquitectura modular**:

app.js - Inicia todos los módulos
navigation.js - Header, menú móvil
language.js - Sistema i18n
carousel.js Carrusel personalizado
form.js - Validación + envío API
utils.js - Funciones auxiliares
scroll-reveal.js - Animaciones basadas en scroll y efectos de revelado
config.js - Constantes de configuración de la aplicación
translations.js - Datos de traducción para ES, EN, FR

El backend usa una única función serverless (send-email.js) con validación y protección antispam.

---

## ⚡ Optimización

- Imágenes **WebP**
- **Lazy Loading**
- **Minificación de CSS/JS**
- Vídeo optimizado
- Carga diferida de JavaScript
- Cache-control configurado
- Recursos críticos priorizados

---

## 📜 Scripts

```bash

npm start              # Desarrollo local
npm run build          # Minificación y preparación para producción
npm run deploy         # Despliegue en Vercel

```

---

## 🌐 Internacionalización

Sistema ligero basado en objetos JSON y localStorage para mantener el idioma seleccionado por el usuario.

```

## 🔒 Seguridad

Headers de seguridad, control CORS, validación de entrada y protección contra spam en la API.

---

## 🚀 Despliegue

El proyecto se despliega en Vercel con funciones serverless y pipeline automatizado para builds de producción.

---

## 📄 Licencia

ISC License

Copyright (c) 2025 Adrián Ortiz Suárez

Se concede permiso para usar, copiar, modificar y/o distribuir este software para cualquier propósito con o sin cargo, siempre que el aviso de copyright anterior y este aviso de permiso aparezcan en todas las copias.

---

## 👨‍💻 Autor

**Adrián Ortiz Suárez**

---

*Este proyecto demuestra habilidades de desarrollo full-stack de nivel empresarial y aplicación empresarial del mundo real.*
