# 🚀 Guía de Deployment en Render

## Problema Identificado
La web solo mostraba header, introducción y footer porque:
1. ✅ **main.js usa módulos ES6 (import/export)** 
2. ✅ **Los scripts no estaban cargando como módulos en el HTML**
3. ✅ **Se cargaban archivos minificados que no existían en producción**

## Soluciones Aplicadas

### 1. ✅ Cambio de carga de JavaScript
**ANTES:**
```html
<script src="main.min.js" defer></script>
```

**DESPUÉS:**
```html
<script type="module" src="main.js" defer></script>
```

### 2. ✅ Cambio de CSS a versión no minificada
**ANTES:**
```html
<link rel="stylesheet" href="styles.min.css">
```

**DESPUÉS:**
```html
<link rel="stylesheet" href="styles.css">
```

### 3. ✅ Configuración de Render
Se creó archivo `render.yaml` para:
- ✅ Ejecutar `npm run build` antes de deployment
- ✅ Servir desde directorio `dist/`
- ✅ Redirigir todas las rutas a `index.html` (SPA)

## Pasos para Desplegar en Render

### Opción 1: Deploy Automático (Recomendado)

1. **Sube los cambios a GitHub:**
   ```bash
   git add .
   git commit -m "Fix: Enable ES6 modules and Render deployment"
   git push origin main
   ```

2. **En Render Dashboard:**
   - Ir a https://dashboard.render.com
   - Conectar repositorio de GitHub si aún no está conectado
   - Crear nuevo servicio "Static Site"
   - Elegir tu repositorio `huelva-tourism`
   - Configurar:
     - **Build Command:** `npm run build`
     - **Publish Directory:** `dist`
   - Click en "Deploy"

### Opción 2: Redeploy desde Dashboard Actual
Si ya tienes un servicio en Render:
1. Ve a tu servicio en Render
2. Click en "Manual Deploy" → "Deploy latest commit"

## Verificación Post-Deployment

✅ Accede a tu URL de Render
✅ Verifica que aparezcan:
- Header con logo
- Introducción
- Secciones de Visitas, Travesías, Actividades, Gastronomía
- Footer
✅ Abre la consola del navegador (F12) y verifica que no hay errores

## Troubleshooting

### Problema: Aún solo aparece header y footer
**Solución:**
1. Abre DevTools (F12)
2. Ve a Network tab
3. Recarga la página
4. Verifica que `main.js` carga sin errores 404
5. Ve a Console tab - busca errores en rojo
6. Si hay error de CORS o importación, contacta al equipo de desarrollo

### Problema: CSS no se aplica
**Solución:**
1. Verifica que `styles.css` esté en la raíz del repositorio
2. En Network tab, confirma que `styles.css` devuelve HTTP 200
3. Si devuelve 404, el archivo no está en el directorio de distribución

### Problema: Las imágenes no se ven
**Solución:**
1. Ve a Network tab y busca solicitudes de imágenes
2. Las rutas deben ser `/images/...` (relativas)
3. Si falta `/images/`, contacta al equipo

## Archivos Modificados

```
✅ index.html           - script type="module" y styles.css
✅ about-us.html        - script type="module" y styles.css
✅ render.yaml          - Configuración de Render (NUEVO)
✅ .renderignore        - Archivos a ignorar en deployment (NUEVO)
✅ build-production.js  - Mejorado para bundling (OPCIONAL)
```

## URLs Útiles

- 📊 Render Dashboard: https://dashboard.render.com
- 📖 Docs de Render: https://render.com/docs
- 🐛 Support: https://render.com/support

## Próximos Pasos (Opcional)

1. **Minificación en producción:**
   - Una vez que funcione, optimizar `main.js` con rollup o esbuild
   - Actualizar `build-production.js`

2. **Optimización de imágenes:**
   - Usar WebP con fallback a JPG
   - Implementar lazy loading

3. **Cache busting:**
   - Agregar hashes a archivos minificados

---

**Última actualización:** Octubre 2025
**Estado:** ✅ Listo para deploy en Render
