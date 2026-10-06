import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist', 'assets');
if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  for (const file of files) {
    if (file.endsWith('.wasm')) {
      const filePath = path.join(distDir, file);
      const stat = fs.statSync(filePath);
      // Cloudflare Pages limit is 25MB (25 * 1024 * 1024 bytes)
      if (stat.size > 25 * 1024 * 1024) {
        fs.unlinkSync(filePath);
        console.log(`Removed large WASM exceeding Cloudflare 25MB limit (${(stat.size / (1024 * 1024)).toFixed(1)}MB):`, file);
      }
    }
  }
}
