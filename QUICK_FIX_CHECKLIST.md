# ⚡ CHECKLIST RÁPIDO - Fix Deployment en Render

## ✅ Lo que Hemos Hecho Ya
- [x] Cambiar `main.min.js` → `main.js` como módulo ES6
- [x] Cambiar `styles.min.css` → `styles.css`
- [x] Actualizar `build-production.js` para módulos ES6
- [x] Crear configuración `render.yaml`
- [x] Crear `.renderignore` para optimizar
- [x] Crear script de testing local

## 📋 AHORA TÚ DEBES HACER:

### 1️⃣ PRUEBA LOCAL (5 minutos)
```bash
npm run build
npm run test-render
```
**Luego:**
1. Abre http://localhost:3000 en navegador
2. ¿Ves TODAS las secciones? (no solo header/footer)
3. Abre DevTools (F12) → Console
4. ¿Hay errores en ROJO? Si no → ¡Continúa!
5. Presiona Ctrl+C en la terminal para detener el servidor

### 2️⃣ COMMIT Y PUSH (2 minutos)
```bash
git add .
git commit -m "Fix: Enable ES6 modules and Render deployment"
git push origin main
```

### 3️⃣ DEPLOY EN RENDER (1 minuto)

**Si YA tienes un servicio en Render:**
1. Ve a https://dashboard.render.com
2. Selecciona tu servicio `come2huelva`
3. Click en "Manual Deploy" → "Deploy latest commit"
4. Espera a que termine (2-3 minutos)

**Si es NUEVO servicio:**
1. Ve a https://dashboard.render.com
2. Click en "+ New" → "Static Site"
3. Conecta tu repositorio de GitHub
4. Rellenar:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Click "Create Static Site"
6. Espera a que termine (3-5 minutos)

### 4️⃣ VERIFICAR QUE FUNCIONA (2 minutos)

Después que Render termine:
1. Abre tu URL de Render (ej: https://come2huelva.onrender.com)
2. ✅ ¿Aparece TODO el contenido?
3. ✅ ¿Funciona el menú de idiomas?
4. ✅ ✅ Abre DevTools (F12) → Console → ¿Sin errores?

**Si falla:** Ve a "Troubleshooting" en `FIX_SUMMARY.md`

---

## 🎯 RESUMEN DE CAMBIOS

Hemos arreglado el problema en **3 líneas clave:**

### En `index.html` (línea 32):
```html
<!-- ANTES: -->
<link rel="stylesheet" href="styles.min.css">

<!-- DESPUÉS: -->
<link rel="stylesheet" href="styles.css">
```

### En `index.html` (línea 509):
```html
<!-- ANTES: -->
<script src="main.min.js" defer></script>

<!-- DESPUÉS: -->
<script type="module" src="main.js" defer></script>
```

### Lo mismo en `about-us.html`

---

## 🔑 POR QUÉ FUNCIONA

- `type="module"` → permite que JavaScript entienda `import`/`export`
- `styles.css` → siempre disponible (no necesita minificar)
- `render.yaml` → Render sabe cómo buildear y servir

---

## ⏱️ TIEMPO TOTAL
- Prueba local: 5 min
- Commit/Push: 2 min  
- Deploy: 3-5 min
- Verificación: 2 min
**= ~15 minutos total**

---

## ❓ ¿QUÉ PASÓ?

**Problema:**
- Tu web funciona en local con bundler local
- Render no ejecuta el bundler, solo sirve archivos estáticos
- Buscaba `main.min.js` que no existía → JavaScript falla silenciosamente
- Sin JavaScript, el contenido no se renderiza

**Solución:**
- Usar `main.js` como módulo ES6 nativo (navegadores lo entienden)
- Usar CSS sin minificar (más simple)
- Render automáticamente buildea con `npm run build`
- Listo ✅

---

**¿Dudas?** Ve a `FIX_SUMMARY.md` para documentación completa.
