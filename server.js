const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const cleanPath = urlPath.replace(/^\/+|\/+$/g, '');

  const candidates = [];
  if (cleanPath === '') {
    candidates.push(path.join(ROOT, 'index.html'));
  } else {
    candidates.push(path.join(ROOT, cleanPath));
    candidates.push(path.join(ROOT, `${cleanPath}.html`));
    candidates.push(path.join(ROOT, cleanPath, 'index.html'));
  }

  let filePath = null;
  for (const candidate of candidates) {
    if (!candidate.startsWith(ROOT)) continue;
    try {
      const stat = fs.statSync(candidate);
      if (stat.isFile()) {
        filePath = candidate;
        break;
      }
    } catch (_) {}
  }

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Nicht gefunden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Ihre IT Rhein-Neckar läuft auf http://localhost:${PORT}`);
});
