const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Image Optimization Script
 * Converts JPG/PNG images to WebP format with quality optimization
 * Reduces file sizes by ~80% while maintaining visual quality
 */

async function optimizeImages(dir) {
  console.log(`\n🔍 Scanning directory: ${dir}`);

  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return;
  }

  let processedCount = 0;
  let skippedCount = 0;
  let totalSizeBefore = 0;
  let totalSizeAfter = 0;

  async function processDirectory(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (entry.isFile() && /\.(jpg|jpeg|png)$/i.test(entry.name)) {
        const outputPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

        // Skip if WebP already exists
        if (fs.existsSync(outputPath)) {
          skippedCount++;
          continue;
        }

        try {
          const stats = fs.statSync(fullPath);
          const sizeBefore = stats.size;
          totalSizeBefore += sizeBefore;

          await sharp(fullPath)
            .webp({ quality: 85, effort: 6 })
            .toFile(outputPath);

          const statsAfter = fs.statSync(outputPath);
          const sizeAfter = statsAfter.size;
          totalSizeAfter += sizeAfter;

          const savings = ((sizeBefore - sizeAfter) / sizeBefore * 100).toFixed(1);

          console.log(`✅ ${path.relative(dir, fullPath)}`);
          console.log(`   ${formatBytes(sizeBefore)} → ${formatBytes(sizeAfter)} (${savings}% reduction)`);

          processedCount++;
        } catch (error) {
          console.error(`❌ Error processing ${entry.name}:`, error.message);
        }
      }
    }
  }

  await processDirectory(dir);

  console.log(`\n📊 Summary for ${dir}:`);
  console.log(`   Processed: ${processedCount} images`);
  console.log(`   Skipped: ${skippedCount} images (WebP already exists)`);

  if (processedCount > 0) {
    const totalSavings = ((totalSizeBefore - totalSizeAfter) / totalSizeBefore * 100).toFixed(1);
    console.log(`   Total size before: ${formatBytes(totalSizeBefore)}`);
    console.log(`   Total size after: ${formatBytes(totalSizeAfter)}`);
    console.log(`   Total savings: ${formatBytes(totalSizeBefore - totalSizeAfter)} (${totalSavings}%)`);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log('This will convert all JPG/PNG images to WebP format.');
  console.log('Original images will be preserved.\n');

  const directories = [
    './public/dark',
    './public/light',
    './public/global'
  ];

  for (const dir of directories) {
    await optimizeImages(dir);
  }

  console.log('\n✨ Image optimization complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Update your image references to use .webp extensions');
  console.log('   2. Test the website to ensure images load correctly');
  console.log('   3. Consider deleting original JPG/PNG files after verification');
}

main().catch(console.error);
