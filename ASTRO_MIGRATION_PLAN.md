# Plan de migración Come2Huelva → Astro

Documento de referencia para migrar la web actual (HTML/CSS/JS vanilla) a **Astro**, manteniendo funcionalidad, SEO y despliegue en Vercel.

---

## 1. Objetivos

- **Escalabilidad**: Componentes reutilizables, estructura clara
- **i18n real**: Rutas `/`, `/en/`, `/fr/` con contenido en servidor (mejor SEO)
- **Rendimiento**: HTML estático, JS mínimo solo donde hace falta
- **Mantenibilidad**: Separación de responsabilidades, tipado opcional
- **Compatibilidad**: Misma API, mismos assets, mismo deploy en Vercel

---

## 2. Estructura actual vs. objetivo

### Actual

```
come2huelva/
├── index.html              # Página principal (todo el contenido)
├── sobre-nosotros.html
├── aviso-legal.html
├── politica-privacidad.html
├── politica-cookies.html
├── 404.html
├── styles.css              # 2500+ líneas, todo en uno
├── js/
│   ├── app.js              # Orquestador
│   ├── language.js         # i18n client-side
│   ├── translations.js     # 1600 líneas de traducciones
│   ├── navigation.js
│   ├── carousel.js         # 776 líneas
│   ├── form.js
│   ├── cookies.js
│   ├── scroll-reveal.js
│   ├── config.js
│   └── utils.js
├── api/
│   └── send-email.js       # Vercel serverless
├── img/
├── video/
└── vercel.json
```

### Objetivo (Astro)

```
come2huelva/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Nav.astro
│   │   │   ├── Footer.astro
│   │   │   └── MainLayout.astro
│   │   ├── ui/
│   │   │   ├── LanguageSelector.tsx      # React island
│   │   │   ├── CookieBanner.tsx          # React island
│   │   │   ├── Carousel.tsx              # React island
│   │   │   └── ContactForm.tsx           # React island
│   │   └── sections/
│   │       ├── HeroVideo.astro
│   │       ├── Introduction.astro
│   │       ├── PlacesCarousel.astro
│   │       ├── ActivitiesCarousel.astro
│   │       ├── GastronomyCarousel.astro
│   │       ├── PlansCarousel.astro
│   │       ├── OpinionsCarousel.astro
│   │       └── ContactFormSection.astro
│   ├── layouts/
│   │   └── MainLayout.astro
│   ├── pages/
│   │   ├── index.astro                   # / (español)
│   │   ├── [...slug].astro               # Catch-all para páginas estáticas
│   │   └── [lang]/
│   │       ├── index.astro               # /en/, /fr/
│   │       ├── sobre-nosotros.astro
│   │       ├── aviso-legal.astro
│   │       ├── politica-privacidad.astro
│   │       └── politica-cookies.astro
│   ├── content/
│   │   └── config.ts                     # Schema si usas Content Collections
│   ├── data/
│   │   └── translations.ts               # Traducciones tipadas
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── components/                   # CSS por componente (opcional)
│   └── utils/
│       ├── scrollReveal.ts
│       └── constants.ts
├── public/
│   ├── img/
│   ├── video/
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
├── api/                                   # Mantener para Vercel
│   └── send-email.js
├── astro.config.mjs
├── vercel.json
└── package.json
```

---

## 3. Fases de migración

### Fase 0: Preparación (1–2 h)

1. Crear branch `feature/astro-migration`
2. Documentar URLs actuales y rutas hreflang
3. Backup del proyecto
4. Crear proyecto Astro en paralelo (nueva carpeta o subcarpeta temporal)

```bash
npm create astro@latest come2huelva-astro
# Elegir: Empty, TypeScript strict, npm
cd come2huelva-astro
npx astro add react
```

### Fase 1: Estructura base (2–3 h)

1. Configurar `astro.config.mjs`:
   - `output: 'static'`
   - Integración con Vercel (`@astrojs/vercel`)
   - Site URL para sitemap
   - i18n routing

2. Copiar `public/img`, `public/video`, assets estáticos

3. Crear `src/styles/global.css`:
   - Migrar variables CSS (`:root`)
   - Migrar estilos base (`html`, `body`)

4. Configurar fuentes (Google Fonts) en layout

### Fase 2: Layout y componentes estáticos (3–4 h)

1. **MainLayout.astro**:
   - `<html>`, `<head>`, meta tags, favicon
   - Slot para contenido
   - Schema.org JSON-LD (pasarlo como prop según página)

2. **Header.astro**:
   - Logo, estructura del header
   - Nav con enlaces (usar traducciones en build)
   - Placeholder para LanguageSelector (island)

3. **Footer.astro**:
   - Logo, contacto, redes, enlaces legales

4. **Nav.astro**:
   - Menú desktop y estructura móvil
   - Enlaces con `Astro.url.pathname` para active state

### Fase 3: Páginas principales (4–5 h)

1. **index.astro** (español):
   - Importar secciones como componentes
   - HeroVideo, Introduction, PlacesCarousel, etc.
   - Datos en español hardcodeados o desde `translations.ts`

2. **Páginas estáticas** (sobre-nosotros, aviso-legal, etc.):
   - Una por archivo o dynamic route `[...slug].astro`
   - Contenido desde traducciones o markdown

3. **404.astro**:
   - Página de error personalizada

### Fase 4: React Islands (5–6 h)

Componentes interactivos que necesitan estado o eventos:

1. **LanguageSelector.tsx**:
   - Dropdown idioma
   - Cambio de idioma → navegar a `/{lang}/` o `/{lang}/ruta`
   - Persistir en `localStorage` para preferencia

2. **CookieBanner.tsx**:
   - Lógica de consentimiento
   - Cerrar, guardar preferencias

3. **Carousel.tsx** (o varios por tipo):
   - Migrar lógica de `carousel.js`
   - Props: `slides`, `type` (places|activities|gastronomy|plans|opinions)
   - Usar `client:visible` para lazy hydration

4. **ContactForm.tsx**:
   - Validación, submit a `/api/send-email`
   - Mensajes de éxito/error
   - Traducciones via props o contexto

### Fase 5: i18n y rutas (2–3 h)

1. Configurar rutas `[lang]`:
   - `/` → español (default)
   - `/en/` → inglés
   - `/fr/` → francés

2. Migrar `translations.js` → `src/data/translations.ts`:
   - Objeto por idioma
   - Tipado TypeScript opcional

3. Generar hreflang en layout según `Astro.url`

4. Sitemap dinámico con todas las URLs (es, en, fr)

### Fase 6: Estilos y pulido (3–4 h)

1. Migrar resto de `styles.css`:
   - Por sección o por componente
   - Variables compartidas
   - Media queries coherentes

2. Revisar responsive (header móvil, carruseles)

3. Scroll reveal: migrar a Astro (ViewTransitions) o script ligero

### Fase 7: API y deploy (1–2 h)

1. Mantener `api/send-email.js` en raíz o adaptar a estructura Vercel

2. Actualizar `vercel.json`:
   - `buildCommand`: `astro build` o `npm run build`
   - `outputDirectory`: `dist`
   - Rewrites para API
   - Headers existentes

3. Variables de entorno (EMAIL, PASSWORD) en Vercel

4. Probar build local: `npm run build && npx serve dist`

---

## 4. Mapeo de funcionalidad actual → Astro/React

| Actual | Astro | React Island | Notas |
|--------|-------|--------------|-------|
| language.js | Layout + rutas [lang] | LanguageSelector | Navegación real entre idiomas |
| translations.js | data/translations.ts | Props a islands | Sin JS en cliente para texto estático |
| navigation.js | Nav.astro + Header.astro | — | Menú móvil con CSS/JS mínimo en Astro |
| carousel.js | — | Carousel.tsx | Lógica compleja, mantener en React |
| form.js | — | ContactForm.tsx | Validación + submit |
| cookies.js | — | CookieBanner.tsx | Consentimiento |
| scroll-reveal.js | View Transitions o script | — | Astro tiene View Transitions nativas |
| app.js | — | — | Orquestación sustituida por islands |

---

## 5. Consideraciones técnicas

### SEO

- Cada idioma = URL propia (`/en/`, `/fr/`)
- hreflang en `<head>`
- Schema.org por página
- Sitemap con todas las URLs
- Meta title/description por página e idioma

### Performance

- Componentes Astro = 0 JS por defecto
- Islands con `client:visible` para cargar solo cuando son visibles
- Imágenes: usar `<Image>` de Astro para optimización
- CSS: crítico en head, resto modular

### Vercel

- Adapter: `@astrojs/vercel` (static)
- API en `/api/send-email` sin cambios
- Redirects y rewrites actuales se mantienen

---

## 6. Estimación total

| Fase | Horas | Acumulado |
|------|-------|-----------|
| 0. Preparación | 1–2 | 2 |
| 1. Estructura base | 2–3 | 5 |
| 2. Layout y estáticos | 3–4 | 9 |
| 3. Páginas principales | 4–5 | 14 |
| 4. React Islands | 5–6 | 20 |
| 5. i18n | 2–3 | 23 |
| 6. Estilos | 3–4 | 27 |
| 7. API y deploy | 1–2 | 29 |
| **Total** | **~25–30 h** | |

---

## 7. Orden recomendado de ejecución

1. Fase 0 + Fase 1: proyecto Astro funcional con estilos base
2. Fase 2: Header, Footer, Nav sin islands
3. Fase 3: index.astro con secciones como HTML estático (sin carruseles interactivos aún)
4. Fase 4: Añadir islands uno a uno (LanguageSelector → CookieBanner → Carousel → Form)
5. Fase 5: Rutas [lang] y traducciones
6. Fase 6: Revisar estilos y responsive
7. Fase 7: Deploy y pruebas en producción

---

## 8. Comandos de referencia

```bash
# Crear proyecto Astro
npm create astro@latest

# Añadir React
npx astro add react

# Añadir Vercel adapter
npx astro add vercel

# Desarrollo
npm run dev

# Build estático
npm run build

# Preview del build
npm run preview
```

---

## 9. Próximo paso

Comenzar por **Fase 0** y **Fase 1**: crear el proyecto Astro, configurarlo y tener la estructura base con estilos globales y `public/` preparado.
