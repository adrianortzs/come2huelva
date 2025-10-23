/**
 * Production testing script for Come2Huelva
 * Tests critical functionality before deployment
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const TESTS = {
  files: [
    'index.html',
    'about-us.html',
    '404.html',
    'manifest.json',
    'robots.txt',
    'sitemap.xml',
    'styles.css',
    'main.js',
    'sw.js'
  ],
  directories: [
    'images',
    'css',
    'js'
  ],
  criticalImages: [
    'images/logonuevo.webp',
    'images/favicon.webp'
  ]
};

// Test functions
function testFileExists(filePath) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${filePath}`);
  return exists;
}

function testDirectoryExists(dirPath) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  console.log(`${exists ? '✅' : '❌'} Directory: ${dirPath}`);
  return exists;
}

function testFileSize(filePath, maxSizeKB = 1000) {
  if (!fs.existsSync(filePath)) return false;
  
  const stats = fs.statSync(filePath);
  const sizeKB = stats.size / 1024;
  const isOk = sizeKB <= maxSizeKB;
  
  console.log(`${isOk ? '✅' : '⚠️'} ${filePath} (${sizeKB.toFixed(1)}KB)`);
  return isOk;
}

function testHTMLStructure(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const tests = [
    { name: 'DOCTYPE', test: content.includes('<!DOCTYPE html>') },
    { name: 'Meta viewport', test: content.includes('name="viewport"') },
    { name: 'Title tag', test: content.includes('<title>') },
    { name: 'Meta description', test: content.includes('name="description"') },
    { name: 'Lang attribute', test: content.includes('lang=') },
    { name: 'Alt attributes', test: (content.match(/<img[^>]*>/g) || []).every(img => img.includes('alt=')) }
  ];
  
  console.log(`\n📄 Testing ${filePath}:`);
  tests.forEach(test => {
    console.log(`  ${test.test ? '✅' : '❌'} ${test.name}`);
  });
  
  return tests.every(test => test.test);
}

function testCSSOptimization() {
  const cssPath = 'styles.css';
  if (!fs.existsSync(cssPath)) return false;
  
  const content = fs.readFileSync(cssPath, 'utf8');
  const tests = [
    { name: 'CSS Variables', test: content.includes(':root') },
    { name: 'Media queries', test: content.includes('@media') },
    { name: 'Flexbox/Grid', test: content.includes('display: flex') || content.includes('display: grid') },
    { name: 'Transitions', test: content.includes('transition') }
  ];
  
  console.log(`\n🎨 Testing CSS optimization:`);
  tests.forEach(test => {
    console.log(`  ${test.test ? '✅' : '❌'} ${test.name}`);
  });
  
  return tests.every(test => test.test);
}

function testJavaScriptOptimization() {
  const jsPath = 'main.js';
  if (!fs.existsSync(jsPath)) return false;
  
  const content = fs.readFileSync(jsPath, 'utf8');
  const tests = [
    { name: 'Strict mode', test: content.includes('use strict') },
    { name: 'Event listeners', test: content.includes('addEventListener') },
    { name: 'Error handling', test: content.includes('try') || content.includes('catch') },
    { name: 'Service Worker', test: content.includes('serviceWorker') }
  ];
  
  console.log(`\n⚡ Testing JavaScript optimization:`);
  tests.forEach(test => {
    console.log(`  ${test.test ? '✅' : '❌'} ${test.name}`);
  });
  
  return tests.every(test => test.test);
}

// Main test function
function runProductionTests() {
  console.log('🧪 Come2Huelva Production Testing\n');
  console.log('=' .repeat(50));
  
  let allTestsPassed = true;
  
  // Test critical files
  console.log('\n📁 Testing critical files:');
  TESTS.files.forEach(file => {
    if (!testFileExists(file)) allTestsPassed = false;
  });
  
  // Test directories
  console.log('\n📂 Testing directories:');
  TESTS.directories.forEach(dir => {
    if (!testDirectoryExists(dir)) allTestsPassed = false;
  });
  
  // Test file sizes
  console.log('\n📏 Testing file sizes:');
  testFileSize('styles.css', 500);
  testFileSize('main.js', 1000);
  
  // Test HTML structure
  testHTMLStructure('index.html');
  testHTMLStructure('about-us.html');
  
  // Test CSS optimization
  testCSSOptimization();
  
  // Test JavaScript optimization
  testJavaScriptOptimization();
  
  // Test critical images
  console.log('\n🖼️  Testing critical images:');
  TESTS.criticalImages.forEach(img => {
    if (!testFileExists(img)) allTestsPassed = false;
  });
  
  // Final result
  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED! Your website is ready for production!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: node build.js');
    console.log('2. Upload dist/ folder to your server');
    console.log('3. Configure SSL certificate');
    console.log('4. Test on live server');
  } else {
    console.log('❌ Some tests failed. Please fix the issues before deploying.');
  }
}

// Run tests
runProductionTests();

