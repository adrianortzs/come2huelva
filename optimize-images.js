const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  inputDir: './images',
  outputDir: './images-optimized',
  quality: {
    jpeg: 85,
    png: 90,
    webp: 85
  },
  maxWidth: 2000,
  maxHeight: 2000
};

async function optimizeImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const baseName = path.basename(inputPath, ext);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Processing: ${path.basename(inputPath)} (${metadata.width}x${metadata.height})`);
    
    const resizeOptions = {};
    if (metadata.width > CONFIG.maxWidth || metadata.height > CONFIG.maxHeight) {
      resizeOptions.width = CONFIG.maxWidth;
      resizeOptions.height = CONFIG.maxHeight;
      resizeOptions.fit = 'inside';
      resizeOptions.withoutEnlargement = true;
    }
    
    const operations = [];
    
    if (ext === '.jpg' || ext === '.jpeg') {
      operations.push(
        image
          .clone()
          .resize(resizeOptions)
          .jpeg({ quality: CONFIG.quality.jpeg, progressive: true })
          .toFile(path.join(outputPath, `${baseName}.jpg`))
      );
    } else if (ext === '.png') {
      operations.push(
        image
          .clone()
          .resize(resizeOptions)
          .png({ quality: CONFIG.quality.png, compressionLevel: 9 })
          .toFile(path.join(outputPath, `${baseName}.png`))
      );
    } else if (ext === '.jfif') {
      operations.push(
        image
          .clone()
          .resize(resizeOptions)
          .jpeg({ quality: CONFIG.quality.jpeg, progressive: true })
          .toFile(path.join(outputPath, `${baseName}.jpg`))
      );
    }
    
    operations.push(
      image
        .clone()
        .resize(resizeOptions)
        .webp({ quality: CONFIG.quality.webp })
        .toFile(path.join(outputPath, `${baseName}.webp`))
    );
    
    await Promise.all(operations);
    
    const originalSize = (await fs.stat(inputPath)).size;
    const optimizedPath = path.join(outputPath, `${baseName}${ext === '.jfif' ? '.jpg' : ext}`);
    const optimizedSize = (await fs.stat(optimizedPath)).size;
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
    
    console.log(`  ✓ Saved ${savings}% (${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB)`);
    
  } catch (error) {
    console.error(`  ✗ Error processing ${path.basename(inputPath)}:`, error.message);
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');
  
  try {
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
  } catch (err) {
    console.error('Error creating output directory:', err);
    return;
  }
  
  const files = await fs.readdir(CONFIG.inputDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.jfif', '.webp'].includes(ext);
  });
  
  console.log(`Found ${imageFiles.length} images to optimize\n`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(CONFIG.inputDir, file);
    await optimizeImage(inputPath, CONFIG.outputDir);
  }
  
  console.log('\n✅ Optimization complete!');
  console.log(`\nOptimized images saved to: ${CONFIG.outputDir}`);
  console.log('\nNext steps:');
  console.log('1. Review optimized images');
  console.log('2. Replace original images folder');
  console.log('3. Update HTML to use WebP with fallbacks (optional)');
}

main().catch(console.error);