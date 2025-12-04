<div align="center">

# 🌍 Come2Huelva

> **Página web premium de turismo en Huelva**  
> Aplicación web moderna, multilingüe y full-stack que muestra prácticas avanzadas de desarrollo y una implementación empresarial real.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Come2Huelva-00C853?style=for-the-badge&logo=vercel&logoColor=white)](https://www.come2huelva.com)
[![Version](https://img.shields.io/badge/version-2.0.2-blue?style=for-the-badge)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?style=for-the-badge&logo=node.js&logoColor=white)](package.json)
[![License](https://img.shields.io/badge/license-ISC-yellow?style=for-the-badge)](LICENSE)

[Características](#-características-principales) • [Tecnologías](#-stack-tecnológico) • [Arquitectura](#-arquitectura) • [Despliegue](#-despliegue)

</div>

---

## 📋 Tabla de Contenidos

<details>
<summary>Ver índice completo</summary>

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Optimizaciones de Rendimiento](#-optimizaciones-de-rendimiento)
- [Scripts Disponibles](#-scripts-disponibles)
- [Internacionalización](#-internacionalización)
- [Seguridad](#-seguridad)
- [Despliegue](#-despliegue)
- [Autor](#-autor)
- [Licencia](#-licencia)

</details>

---

## 🎯 Descripción General

**Come2Huelva** es una página web multilingüe orientada a un operador turístico local. Combina una arquitectura frontend modular con funciones serverless para ofrecer contacto, internacionalización, formularios y un diseño profesional centrado en la experiencia de usuario.

<div align="center">

![Come2Huelva](https://img.shields.io/badge/Status-Production-2ecc71?style=flat-square)
![Languages](https://img.shields.io/badge/Languages-3-blue?style=flat-square)
![Performance](https://img.shields.io/badge/Performance-Optimized-green?style=flat-square)

</div>

---

## ✨ Características Principales

<table>
<tr>
<td width="50%">

### 🎨 Frontend
- ✅ **Responsive Design** (mobile first)
- ✅ **Carruseles Interactivos** con soporte touch/swipe
- ✅ **Animaciones en scroll** suaves
- ✅ **Video hero** optimizado

</td>
<td width="50%">

### 🔧 Funcionalidades
- ✅ **Gestión de idioma** (ES / EN / FR)
- ✅ **Consentimiento de cookies** GDPR
- ✅ **Formulario de contacto** con validación
- ✅ **Backend serverless** (Nodemailer)
- ✅ **SEO avanzado** completo

</td>
</tr>
</table>

### 🚀 Optimizaciones
- 🖼️ **WebP** para imágenes
- ⚡ **Lazy Loading** inteligente
- 📦 **Minificación** CSS/JS
- 🎬 **Vídeo optimizado**
- 🧹 **Carga diferida** de JavaScript
- 💾 **Cache-Control** configurado

---

## 🛠️ Stack Tecnológico

<div align="center">

### Frontend

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Fonts](https://img.shields.io/badge/Google_Fonts-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Bootstrap Icons](https://img.shields.io/badge/Bootstrap_Icons-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Serverless-4A90E2?style=for-the-badge)

### Build Tools

![Terser](https://img.shields.io/badge/Terser-Minifier-FF6B6B?style=for-the-badge)
![CSSnano](https://img.shields.io/badge/CSSnano-Optimizer-FF6B6B?style=for-the-badge)
![PostCSS](https://img.shields.io/badge/PostCSS-Processor-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)

</div>

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

La aplicación sigue un patrón de **arquitectura modular** con separación clara de responsabilidades:

### 📦 Módulos Frontend

| Módulo | Responsabilidad |
|--------|----------------|
| **app.js** | Orquestador principal de la aplicación |
| **navigation.js** | Header, menú móvil y navegación |
| **language.js** | Sistema i18n (ES / EN / FR) |
| **carousel.js** | Carruseles personalizados con drag/swipe |
| **form.js** | Validación y envío al backend |
| **scroll-reveal.js** | Animaciones basadas en scroll |
| **cookies.js** | Gestión de consentimiento GDPR |
| **utils.js** | Funciones auxiliares compartidas |
| **config.js** | Constantes de configuración |
| **translations.js** | Datos de traducción |

### 🔧 Backend

El backend utiliza una única función serverless (`send-email.js`) con:
- ✅ Validación de entrada
- ✅ Protección antispam (rate limiting)
- ✅ Manejo de errores robusto
- ✅ Configuración CORS

---

## ⚡ Optimizaciones de Rendimiento

<div align="center">

| Optimización | Tecnología | Beneficio |
|-------------|------------|-----------|
| **Imágenes** | WebP | 30-50% más ligeras |
| **Carga diferida** | Lazy Loading | Mejora LCP |
| **Minificación** | Terser + CSSnano | Reduce tamaño 40-60% |
| **Caché** | Cache-Control | Mejora velocidad |
| **CSS crítico** | Inline | Reduce FCP |
| **Vídeo** | Optimizado | Carga progresiva |

</div>

---

## 📜 Scripts Disponibles

```bash
# Desarrollo local
npm start              # Servidor local en puerto 8080

# Producción
npm run build          # Minificación CSS/JS
npm run minify         # Alias de build

# Despliegue
npm run dev            # Servidor de desarrollo Vercel
npm run deploy         # Despliegue a producción
npm run vercel-build   # Build para Vercel
```

---

## 🌐 Internacionalización

Sistema ligero basado en objetos JSON y `localStorage` para mantener el idioma seleccionado:

- 🇪🇸 **Español** (ES) - Idioma por defecto
- 🇬🇧 **English** (EN) - Inglés
- 🇫🇷 **Français** (FR) - Francés

El idioma seleccionado se persiste entre sesiones y se aplica automáticamente al recargar la página.

---

## 🔒 Seguridad

### Headers HTTP
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` configurado
- `Strict-Transport-Security` (HSTS)
- `Referrer-Policy: strict-origin-when-cross-origin`

### API
- ✅ Validación de entrada
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Saneamiento de datos
- ✅ Manejo seguro de errores

### Archivos Protegidos
- Bloqueo de acceso a `.env`, `package.json`, `.htaccess`, etc.

---

## 🚀 Despliegue

El proyecto está configurado para despliegue continuo en **Vercel** con:

- ⚡ **Builds automáticos** desde Git
- 🔄 **CI/CD pipeline** integrado
- ☁️ **Funciones serverless** sin configuración
- 📊 **Analytics** y monitoring
- 🚀 **Edge Network** global

### Variables de Entorno

Configura las siguientes variables en Vercel:

```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=tu_email@example.com
EMAIL_PASS=tu_contraseña
EMAIL_TO=destino@example.com
```

---

## 👨‍💻 Autor

<div align="center">

**Adrián Ortiz Suárez**

[![Website](https://img.shields.io/badge/Website-www.come2huelva.com-00C853?style=flat-square)](https://www.come2huelva.com)

</div>

---

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**.

```
Copyright (c) 2025 Adrián Ortiz Suárez

Se concede permiso para usar, copiar, modificar y/o distribuir este software 
para cualquier propósito con o sin cargo, siempre que el aviso de copyright 
anterior y este aviso de permiso aparezcan en todas las copias.
```

---

<div align="center">

### 🌟 ¿Te gustó el proyecto?

⭐ **Dale una estrella** si te ha sido útil

---

*Este proyecto demuestra habilidades de desarrollo full-stack de nivel empresarial y aplicación empresarial del mundo real.*

**Desarrollado con ❤️ para mostrar Huelva al mundo**

</div>
