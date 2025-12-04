const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const postcss = require('postcss');
const cssnano = require('cssnano');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

async function minifyCSS(targetFile) {
  const cssPath = path.resolve(targetFile);
  if (!fs.existsSync(cssPath)) return;
  const input = fs.readFileSync(cssPath, 'utf8');
  const before = Buffer.byteLength(input);
  const result = await postcss([cssnano({ preset: 'default' })]).process(input, { from: cssPath, to: cssPath });
  fs.writeFileSync(cssPath, result.css, 'utf8');
  const after = Buffer.byteLength(result.css);
  console.log(`CSS minified: ${targetFile}  ${formatBytes(before)} → ${formatBytes(after)} (-${(((before - after) / before) * 100).toFixed(1)}%)`);
}

const MINIFY_OPTIONS = {
  module: true,
  compress: {
    passes: 2,
    pure_getters: true,
    unsafe_arrows: true
  },
  mangle: true,
  format: {
    comments: false
  }
};

async function minifyJSFile(filePath, displayName) {
  if (!fs.existsSync(filePath)) return;
  const code = fs.readFileSync(filePath, 'utf8');
  const before = Buffer.byteLength(code);
  const result = await minify(code, MINIFY_OPTIONS);
  if (result.code) {
    fs.writeFileSync(filePath, result.code, 'utf8');
    const after = Buffer.byteLength(result.code);
    console.log(`JS minified: ${displayName}  ${formatBytes(before)} → ${formatBytes(after)} (-${(((before - after) / before) * 100).toFixed(1)}%)`);
  }
}

async function minifyJS(dir) {
  const dirPath = path.resolve(dir);
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const full = path.join(dirPath, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) continue;
    if (!entry.endsWith('.js')) continue;
    await minifyJSFile(full, `js/${entry}`);
  }
}

async function minifyJSFiles(files) {
  for (const file of files) {
    const jsPath = path.resolve(file);
    await minifyJSFile(jsPath, file);
  }
}

(async () => {
  try {
    await minifyCSS('styles.css');
    await minifyJS('js');
    await minifyJSFiles(['sw.js']);
    console.log('Minification completed successfully.');
  } catch (err) {
    console.error('Minification failed:', err);
    process.exit(1);
  }
})();
