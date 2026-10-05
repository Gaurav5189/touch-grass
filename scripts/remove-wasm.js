import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist', 'assets');
const files = fs.readdirSync(distDir);
for (const file of files) {
  if (file.endsWith('.wasm')) {
    const filePath = path.join(distDir, file);
    fs.unlinkSync(filePath);
    console.log('Removed large WASM for Cloudflare deployment:', file);
  }
}
