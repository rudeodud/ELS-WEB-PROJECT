const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT     = process.env.PORT || 3000;
const FRONTEND = path.join(__dirname, '..', 'frontend');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  // 경로 정규화 및 디렉토리 트래버설 방지
  const urlPath = req.url.split('?')[0];
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');

  // "/" 요청은 index.html 로
  const filePath = path.join(
    FRONTEND,
    safePath === '/' ? 'index.html' : safePath
  );

  // frontend 디렉토리 밖 접근 차단
  if (!filePath.startsWith(FRONTEND)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext      = path.extname(filePath).toLowerCase();
    const mimeType = MIME[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`서버 실행 중 → http://localhost:${PORT}`);
});
