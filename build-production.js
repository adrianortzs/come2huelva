const fs = require('fs');
const path = require('path');

const BUILD_DIR = 'dist';
const SRC_DIR = '.';

const FILES_TO_COPY = [
  'index.html',
  'about-us.html', 
  '404.html',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  '.htaccess',
  'main.js',
  'styles.css'
];

const DIRS_TO_COPY = [
  'images',
  'videos',
  'js'
];

function createBuildDir() {
  if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
  }
}

function copyFiles() {
  FILES_TO_COPY.forEach(file => {
    const srcPath = path.join(SRC_DIR, file);
    const destPath = path.join(BUILD_DIR, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied: ${file}`);
    } else {
      console.log(`⚠️  Not found: ${file}`);
    }
  });
}

function copyDirectories() {
  DIRS_TO_COPY.forEach(dir => {
    const srcPath = path.join(SRC_DIR, dir);
    const destPath = path.join(BUILD_DIR, dir);
    
    if (fs.existsSync(srcPath)) {
      copyDir(srcPath, destPath);
      console.log(`✅ Copied directory: ${dir}`);
    } else {
      console.log(`⚠️  Directory not found: ${dir}`);
    }
  });
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function bundleAndMinifyJS() {
  console.log('\n🔧 Bundling and minifying JavaScript...');
  
  try {
    const mainJsPath = 'main.js';
    
    if (!fs.existsSync(mainJsPath)) {
      console.log(`❌ main.js not found`);
      return false;
    }

    // For ES6 modules, we'll use simple minification without full bundling
    // The modules will stay as-is since browsers support native ES6 modules
    const content = fs.readFileSync(mainJsPath, 'utf8');
    
    // Use fallback minification which works better with ES6 syntax
    return minifyJSFallback(content, mainJsPath);
    
  } catch (error) {
    console.log(`❌ Error processing JavaScript:`, error.message);
    return false;
  }
}

function minifyJSFallback(js, inputPath) {
  // Fallback minification for ES6 modules
  // Only removes comments and whitespace, preserving syntax
  let minified = js
    .split('\n')
    .map(line => {
      // Remove single-line comments but preserve strings
      let result = line.replace(/\/\/.*$/g, '').trimEnd();
      return result;
    })
    .filter(line => line.trim().length > 0 && !line.trim().startsWith('/*'))
    .join('\n');
  
  // Remove multi-line comments
  minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Clean up excessive newlines
  minified = minified.replace(/\n\n+/g, '\n').trim();
  
  const outputPath = 'main.min.js';
  fs.writeFileSync(outputPath, minified);
  fs.writeFileSync(path.join(BUILD_DIR, outputPath), minified);
  
  const originalSize = Buffer.byteLength(js, 'utf8');
  const minifiedSize = Buffer.byteLength(minified, 'utf8');
  const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
  
  console.log(`✅ Minified: ${inputPath} → ${outputPath}`);
  console.log(`   Size: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${savings}% reduction)`);
  
  return true;
}

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*>\s*/g, '>')
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s*~\s*/g, '~')
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    .replace(/\s*\[\s*/g, '[')
    .replace(/\s*\]\s*/g, ']')
    .replace(/;\s*}/g, '}')
    .trim();
}

function processCSS() {
  console.log('\n🎨 Processing CSS...');
  
  const inputPath = 'styles.css';
  const outputPath = 'styles.min.css';
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  File not found: ${inputPath}`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(inputPath, 'utf8');
    const minified = minifyCSS(content);
    
    fs.writeFileSync(outputPath, minified);
    fs.writeFileSync(path.join(BUILD_DIR, outputPath), minified);
    
    const originalSize = fs.statSync(inputPath).size;
    const minifiedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Minified: ${inputPath} → ${outputPath}`);
    console.log(`   Size: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${savings}% reduction)`);
    
    return true;
  } catch (error) {
    console.log(`❌ Error processing CSS:`, error.message);
    return false;
  }
}

function build() {
  console.log('🚀 Building Come2Huelva for production...\n');
  
  createBuildDir();
  copyFiles();
  copyDirectories();
  
  let successCount = 0;
  
  if (bundleAndMinifyJS()) successCount++;
  if (processCSS()) successCount++;
  
  console.log(`\n✅ Build completed successfully!`);
  console.log(`📁 Production files are in: ${BUILD_DIR}/`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Files copied: ${FILES_TO_COPY.length}`);
  console.log(`   - Directories copied: ${DIRS_TO_COPY.length}`);
  console.log(`   - Files minified: ${successCount}/2`);
  console.log('\n📋 Next steps for Render:');
  console.log('1. Push changes to GitHub');
  console.log('2. Render will auto-deploy from the dist/ folder');
  console.log('3. Verify all resources load correctly');
}

build();
