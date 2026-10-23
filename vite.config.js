import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function contentApiPlugin() {
  const contentDir = path.resolve(process.cwd(), 'data');
  const contentFilePath = path.join(contentDir, 'content.json');
  const publicDir = path.resolve(process.cwd(), 'public/data');
  const publicFilePath = path.join(publicDir, 'content.json');

  const handleMiddleware = (req, res, next) => {
    const url = req.url ? req.url.split('?')[0] : '';
    if (url === '/api/content') {
      if (req.method === 'GET') {
        try {
          if (fs.existsSync(contentFilePath)) {
            const data = fs.readFileSync(contentFilePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(data);
            return;
          } else if (fs.existsSync(publicFilePath)) {
            const data = fs.readFileSync(publicFilePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(data);
            return;
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({}));
            return;
          }
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
          return;
        }
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });
            if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

            const jsonStr = JSON.stringify(parsed, null, 2);
            fs.writeFileSync(contentFilePath, jsonStr, 'utf-8');
            fs.writeFileSync(publicFilePath, jsonStr, 'utf-8');

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }
    }
    next();
  };

  return {
    name: 'content-api-plugin',
    configureServer(server) {
      server.middlewares.use(handleMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleMiddleware);
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contentApiPlugin()],
});
