# 🚀 SETUP RENDER - Paso a Paso

## ⚠️ IMPORTANTE: Lee esto COMPLETO antes de hacer nada

---

## 🎯 Opción 1: Si YA tienes un servicio en Render (Más fácil)

### Paso 1: Ve a Render Dashboard
1. Abre: https://dashboard.render.com
2. **Busca tu servicio "come2huelva"** en la lista

### Paso 2: Redeploy Manual
1. Click en **tu servicio**
2. Baja hasta encontrar botón **"Manual Deploy"**
3. Click en la flecha al lado → **"Deploy latest commit"**
4. Espera 3-5 minutos mientras dice "Building..."
5. Cuando termine, debería cambiar el estado a "Live"

### Paso 3: Verifica
1. Copia la URL del servicio (algo como: `https://come2huelva-xxxxx.onrender.com`)
2. Abre en navegador
3. **Verifica:**
   - ✅ ¿Ves TODAS las secciones? (no solo header/footer)
   - ✅ Abre DevTools (F12) → Console
   - ✅ ¿Hay errores en ROJO? Si hay → Ve a Troubleshooting

**FIN - Tu web ya debería estar VIVA** 🎉

---

## 🎯 Opción 2: Si es NUEVO servicio en Render (Más pasos)

### Paso 1: Crear nuevo servicio
1. Abre: https://dashboard.render.com
2. Click azul **"+ New"** arriba a la derecha
3. Elige **"Static Site"** (NO "Web Service")

### Paso 2: Conectar GitHub
1. **Repository:** Selecciona `adrianortzs/huelva-tourism`
2. **Branch:** `main`
3. Click **"Create Static Site"**

### Paso 3: Configurar Build
Render debería auto-detectar, pero verifica:

**Si ve la pantalla de configuración:**
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- Click **"Create Static Site"**

**Si entra directo al deployment:**
- Espera a que termine (5-10 minutos)
- Cuando esté en estado "Live", es que funcionó

### Paso 4: Verifica
1. Click en la URL que aparece arriba
2. **Verifica:**
   - ✅ ¿Ves TODAS las secciones?
   - ✅ Abre DevTools (F12) → Console
   - ✅ ¿Sin errores rojos?

**FIN - Tu web ya está VIVA** 🎉

---

## 🔧 Troubleshooting - Si algo no funciona

### Problema 1: Solo aparece header/footer, nada más

**Causas posibles:**
1. JavaScript no está cargando
2. CSS no se aplica
3. Render no ejecutó el build

**Solución:**
1. Abre DevTools (F12)
2. Ve a **Console** tab
3. ¿Hay errores rojos? Anota qué dice
4. Ve a **Network** tab
5. Recarga la página (Ctrl+R)
6. ¿`main.js` muestra 200 o 404?
7. Si es 404 → El archivo no está en dist/

### Problema 2: Error "Build failed"

**Solución:**
1. Abre la URL de Render
2. Baja a **"Build Logs"**
3. Lee qué dice el error
4. Probablemente: `npm run build` falló
5. Asegúrate que `build-production.js` existe

### Problema 3: CSS no se aplica

**Solución:**
1. DevTools → Network tab
2. Busca `styles.css`
3. ¿Status 200? Si es 200 pero no se ve CSS:
   - Borra caché: Ctrl+Shift+R (reload hard)
   - Cierra DevTools y vuelve a abrir
4. ¿Status 404? Significa que falta `styles.css` en `dist/`

### Problema 4: Las imágenes no se ven

**Solución:**
1. DevTools → Network tab
2. Recarga
3. Busca `images/...`
4. ¿Status 404? Verifica que carpeta `/images/` está en `/dist/`
5. Ejecuta `npm run build` localmente de nuevo

---

## ✅ Checklist Final

Antes de preguntar por ayuda, verifica:

- [ ] ¿Hiciste `git push origin main`?
- [ ] ¿El commit aparece en GitHub?
- [ ] ¿render.yaml o render.json existen?
- [ ] ¿En Render dice "Live" o "Building"?
- [ ] ¿Abriste DevTools (F12)?
- [ ] ¿Viste los logs de build?
- [ ] ¿Borraste caché (Ctrl+Shift+R)?

---

## 🚨 ÚLTIMA OPCIÓN: Si nada funciona

Prueba esto EXACTAMENTE:

```bash
# 1. Limpia todo
cd "C:\Users\adria\Desktop\huelva-tourism"
rm -rf dist node_modules
npm cache clean --force

# 2. Reinstala
npm install

# 3. Rebuild
npm run build

# 4. Commit y push
git add .
git commit -m "Rebuild: Clean reinstall"
git push origin main

# 5. En Render: Manual Deploy de nuevo
```

---

## 📞 Si aún no funciona

Por favor, comparte:
1. **URL de tu sitio en Render**
2. **Screenshot de DevTools Console**
3. **Screenshot de DevTools Network (busca main.js)**
4. **Los últimos 5 commits en GitHub**

---

**Listo para ir a Render? ¡Adelante! 🚀**
