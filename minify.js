/**
 * Minification script for Come2Huelva
 * Creates minified versions of CSS and JS files
 */

const fs = require('fs');
const path = require('path');

// Configuration
const FILES_TO_MINIFY = [
  {
    input: 'styles.css',
    output: 'styles.min.css'
  },
  {
    input: 'main.js',
    output: 'main.min.js'
  }
];

// Minify CSS
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    // Remove spaces around braces
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    // Remove spaces around colons
    .replace(/\s*:\s*/g, ':')
    // Remove spaces around semicolons
    .replace(/\s*;\s*/g, ';')
    // Remove spaces around commas
    .replace(/\s*,\s*/g, ',')
    // Remove spaces around operators
    .replace(/\s*>\s*/g, '>')
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s*~\s*/g, '~')
    // Remove spaces around parentheses
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    // Remove spaces around brackets
    .replace(/\s*\[\s*/g, '[')
    .replace(/\s*\]\s*/g, ']')
    // Remove trailing semicolons before closing braces
    .replace(/;\s*}/g, '}')
    // Remove leading/trailing whitespace
    .trim();
}

// Minify JavaScript
function minifyJS(js) {
  return js
    // Remove single-line comments (but preserve // in strings)
    .replace(/(?<!['"`])\/\/.*$/gm, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    // Remove spaces around operators
    .replace(/\s*=\s*/g, '=')
    .replace(/\s*\+\s*/g, '+')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*\*\s*/g, '*')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*%\s*/g, '%')
    .replace(/\s*&&\s*/g, '&&')
    .replace(/\s*\|\|\s*/g, '||')
    .replace(/\s*==\s*/g, '==')
    .replace(/\s*!=\s*/g, '!=')
    .replace(/\s*===\s*/g, '===')
    .replace(/\s*!==\s*/g, '!==')
    .replace(/\s*<\s*/g, '<')
    .replace(/\s*>\s*/g, '>')
    .replace(/\s*<=\s*/g, '<=')
    .replace(/\s*>=\s*/g, '>=')
    // Remove spaces around parentheses
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    // Remove spaces around brackets
    .replace(/\s*\[\s*/g, '[')
    .replace(/\s*\]\s*/g, ']')
    // Remove spaces around braces
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    // Remove spaces around commas
    .replace(/\s*,\s*/g, ',')
    // Remove spaces around semicolons
    .replace(/\s*;\s*/g, ';')
    // Remove spaces around colons
    .replace(/\s*:\s*/g, ':')
    // Remove spaces around dots
    .replace(/\s*\.\s*/g, '.')
    // Remove spaces around arrows
    .replace(/\s*=>\s*/g, '=>')
    // Remove leading/trailing whitespace
    .trim();
}

// Process a single file
function processFile(fileConfig) {
  const inputPath = fileConfig.input;
  const outputPath = fileConfig.output;
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  File not found: ${inputPath}`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(inputPath, 'utf8');
    let minified;
    
    if (inputPath.endsWith('.css')) {
      minified = minifyCSS(content);
    } else if (inputPath.endsWith('.js')) {
      minified = minifyJS(content);
    } else {
      console.log(`⚠️  Unsupported file type: ${inputPath}`);
      return false;
    }
    
    fs.writeFileSync(outputPath, minified);
    
    const originalSize = fs.statSync(inputPath).size;
    const minifiedSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Minified: ${inputPath} → ${outputPath}`);
    console.log(`   Size: ${(originalSize / 1024).toFixed(1)}KB → ${(minifiedSize / 1024).toFixed(1)}KB (${savings}% reduction)`);
    
    return true;
  } catch (error) {
    console.log(`❌ Error processing ${inputPath}:`, error.message);
    return false;
  }
}

// Generate source map for JavaScript
function generateSourceMap(inputPath, outputPath) {
  if (!inputPath.endsWith('.js')) return;
  
  const mapPath = outputPath + '.map';
  const sourceMap = {
    version: 3,
    file: path.basename(outputPath),
    sourceRoot: '',
    sources: [path.basename(inputPath)],
    names: [],
    mappings: ''
  };
  
  try {
    fs.writeFileSync(mapPath, JSON.stringify(sourceMap, null, 2));
    console.log(`✅ Generated source map: ${mapPath}`);
  } catch (error) {
    console.log(`⚠️  Could not generate source map: ${error.message}`);
  }
}

// Main function
function minify() {
  console.log('🔧 Minifying files...\n');
  
  let successCount = 0;
  
  FILES_TO_MINIFY.forEach(fileConfig => {
    if (processFile(fileConfig)) {
      successCount++;
      generateSourceMap(fileConfig.input, fileConfig.output);
    }
  });
  
  console.log(`\n✅ Minification complete! ${successCount}/${FILES_TO_MINIFY.length} files processed.`);
  
  if (successCount === FILES_TO_MINIFY.length) {
    console.log('\n📋 Next steps:');
    console.log('1. Update your HTML to use the .min files in production');
    console.log('2. Test the minified files thoroughly');
    console.log('3. Consider using a CDN for better performance');
  }
}

// Run minification
minify();
