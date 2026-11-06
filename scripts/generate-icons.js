import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  // 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('pwa-192x192.png created');

  // 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('pwa-512x512.png created');

  // apple-touch-icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('apple-touch-icon.png created');

  // maskable 512x512 with 15% safe-zone margin
  const innerSize = Math.round(512 * 0.75); // 384
  const innerBuffer = await sharp(svgBuffer).resize(innerSize, innerSize).toBuffer();
  
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 16, g: 19, b: 24, alpha: 1 }
    }
  })
    .composite([{ input: innerBuffer, gravity: 'center' }])
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('pwa-maskable-512x512.png created');

  // favicon.ico (fallback 48x48)
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile('public/favicon.ico');
  console.log('favicon.ico created');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
