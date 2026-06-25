const fs = require('fs');
const path = require('path');

// Define source and destination
const srcDir = path.join(__dirname, '..');
const destDir = path.join(__dirname, '..', 'build');

try {
  // Clean build directory
  console.log('🧹 Cleaning build directory...');
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(destDir, { recursive: true });

  // Define what to copy (directories and file patterns)
  const directoriesToCopy = ['css', 'js', 'images', 'components', 'admin'];
  const filesToCopy = [
    'index.html',
    'about.html',
    'cart.html',
    'checkout.html',
    'contact.html',
    'faq.html',
    'products.html',
    'product.html',
    'robots.txt',
    'sitemap.xml'
  ];

  console.log('📦 Copying files...\n');

  // Copy single files
  filesToCopy.forEach(file => {
    const src = path.join(srcDir, file);
    if (fs.existsSync(src)) {
      const dest = path.join(destDir, file);
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied: ${file}`);
    } else {
      console.log(`⚠️ Skipped (not found): ${file}`);
    }
  });

  // Copy directories recursively
  function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.forEach(entry => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        const relativePath = path.relative(srcDir, srcPath);
        console.log(`✅ Copied: ${relativePath}`);
      }
    });
  }

  directoriesToCopy.forEach(dir => {
    const src = path.join(srcDir, dir);
    if (fs.existsSync(src)) {
      copyDirectory(src, path.join(destDir, dir));
    } else {
      console.log(`⚠️ Skipped (not found): ${dir}/`);
    }
  });

  console.log('\n🎉 Build complete!');
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
}
