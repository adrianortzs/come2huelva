/**
 * Build script for Come2Huelva
 * Optimizes files for production
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BUILD_DIR = 'dist';
const SRC_DIR = '.';

// Files to copy
const FILES_TO_COPY = [
  'index.html',
  'about-us.html', 
  '404.html',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  '.htaccess'
];

// Directories to copy
const DIRS_TO_COPY = [
  'images',
  'videos',
  'css',
  'js'
];

// Create build directory
function createBuildDir() {
  if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true });
  }
}

// Copy files
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

// Copy directories
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

// Recursive directory copy
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

// Minify CSS (basic)
function minifyCSS() {
  const cssPath = path.join(BUILD_DIR, 'styles.css');
  if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    
    // Basic minification
    css = css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
      .replace(/;\s*/g, ';') // Remove spaces after semicolons
      .trim();
    
    fs.writeFileSync(cssPath, css);
    console.log('✅ Minified CSS');
  }
}

// Main build function
function build() {
  console.log('🚀 Building Come2Huelva for production...\n');
  
  createBuildDir();
  copyFiles();
  copyDirectories();
  minifyCSS();
  
  console.log('\n✅ Build completed successfully!');
  console.log(`📁 Production files are in: ${BUILD_DIR}/`);
  console.log('\n📋 Next steps:');
  console.log('1. Upload the dist/ folder to your web server');
  console.log('2. Configure SSL certificate');
  console.log('3. Test the website thoroughly');
  console.log('4. Set up monitoring and analytics');
}

// Run build
build();

