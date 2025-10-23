#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DIST_DIR = path.join(__dirname, 'dist');

console.log('🚀 Iniciando servidor local para simular Render...');
console.log(`📁 Sirviendo archivos desde: ${DIST_DIR}`);
console.log(`🌐 Accede a: http://localhost:${PORT}`);
console.log(`⏹️  Presiona Ctrl+C para detener\n`);

const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_DIR, req.url);
  
  // Handle SPA - redirect to index.html for all non-file requests
  if (!path.extname(filePath) && !filePath.endsWith('.js') && !filePath.endsWith('.css') && !filePath.endsWith('.json')) {
    filePath = path.join(DIST_DIR, 'index.html');
  }
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>404 - Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 50px; }
            h1 { color: #d32f2f; }
          </style>
        </head>
        <body>
          <h1>404 - Archivo no encontrado</h1>
          <p>Ruta: ${req.url}</p>
          <p><a href="/">Volver al inicio</a></p>
        </body>
        </html>
      `);
      console.log(`❌ 404: ${req.url}`);
      return;
    }
    
    // Set correct content types
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'application/javascript';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.json') contentType = 'application/json';
    if (ext === '.webp') contentType = 'image/webp';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.svg') contentType = 'image/svg+xml';
    if (ext === '.mp4') contentType = 'video/mp4';
    if (ext === '.woff') contentType = 'font/woff';
    if (ext === '.woff2') contentType = 'font/woff2';
    
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(data);
    
    console.log(`✅ 200: ${req.url} [${contentType}]`);
  });
});

server.listen(PORT, () => {
  console.log(`\n✨ Servidor escuchando en puerto ${PORT}`);
  console.log(`\n📋 Checklist de prueba:\n`);
  console.log(`   [ ] Accede a http://localhost:${PORT}`);
  console.log(`   [ ] Verifica que aparece todo el contenido (no solo header/footer)`);
  console.log(`   [ ] Abre DevTools (F12) → Console y verifica sin errores en rojo`);
  console.log(`   [ ] Abre DevTools → Network y verifica que main.js carga sin 404`);
  console.log(`   [ ] Prueba el menú de idiomas`);
  console.log(`   [ ] Prueba desplazarse a diferentes secciones`);
  console.log(`   [ ] Verifica que las imágenes se cargan correctamente\n`);
});

process.on('SIGINT', () => {
  console.log('\n\n⏹️  Servidor detenido');
  process.exit(0);
});
