// client/create-assets.js
const fs = require('fs');
const path = require('path');

console.log('Creating required assets...');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
  console.log('✅ Created assets directory');
}

// Create a simple PNG (1x1 transparent pixel)
const pngData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');

// Create required image files
const requiredImages = [
  'icon.png',
  'splash.png',
  'adaptive-icon.png',
  'favicon.png'
];

requiredImages.forEach(imageName => {
  const imagePath = path.join(assetsDir, imageName);
  if (!fs.existsSync(imagePath)) {
    fs.writeFileSync(imagePath, pngData);
    console.log(`✅ Created ${imageName}`);
  }
});

console.log('Assets creation completed!');