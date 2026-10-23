import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = path.join(__dirname, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const PUBLIC_DATA_DIR = path.join(__dirname, 'public', 'data');
const PUBLIC_CONTENT_FILE = path.join(PUBLIC_DATA_DIR, 'content.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  const url = req.url ? req.url.split('?')[0] : '/';

  // API Route: /api/content
  if (url === '/api/content') {
    if (req.method === 'GET') {
      try {
        if (fs.existsSync(CONTENT_FILE)) {
          const data = fs.readFileSync(CONTENT_FILE, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
          return;
        } else if (fs.existsSync(PUBLIC_CONTENT_FILE)) {
          const data = fs.readFileSync(PUBLIC_CONTENT_FILE, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
          return;
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({}));
          return;
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
          if (!fs.existsSync(PUBLIC_DATA_DIR)) fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });

          const jsonStr = JSON.stringify(parsed, null, 2);
          fs.writeFileSync(CONTENT_FILE, jsonStr, 'utf-8');
          fs.writeFileSync(PUBLIC_CONTENT_FILE, jsonStr, 'utf-8');

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Saved successfully' }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

  // Serve static assets from dist
  let filePath = path.join(DIST_DIR, url === '/' ? 'index.html' : url);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // SPA Fallback: serve index.html
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found. Make sure to run npm run build first.');
  }
});

server.listen(PORT, () => {
  console.log(`Magma Studios Server corriendo en http://localhost:${PORT}`);
});
