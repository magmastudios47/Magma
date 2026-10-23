import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const contentPath = path.join(process.cwd(), 'data', 'content.json');
  const publicPath = path.join(process.cwd(), 'public', 'data', 'content.json');

  if (req.method === 'GET') {
    try {
      if (fs.existsSync(contentPath)) {
        const data = fs.readFileSync(contentPath, 'utf-8');
        return res.status(200).json(JSON.parse(data));
      } else if (fs.existsSync(publicPath)) {
        const data = fs.readFileSync(publicPath, 'utf-8');
        return res.status(200).json(JSON.parse(data));
      }
      return res.status(200).json({});
    } catch {
      return res.status(200).json({});
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      const dataToSave = typeof body === 'string' ? JSON.parse(body) : body;
      
      try {
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(contentPath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      } catch {
        // En Vercel el sistema de archivos puede ser read-only
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
