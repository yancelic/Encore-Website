import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = http.createServer(async (req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = resolve(root, `.${name === '/' ? '/index.html' : name}`);
  if (!file.startsWith(root + sep)) { res.writeHead(403); return res.end(); }
  try { const data = await readFile(file); res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }); res.end(data); }
  catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(4173, '127.0.0.1', () => console.log('Encore preview: http://127.0.0.1:4173'));
