import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('build/static/js', { recursive: true });
writeFileSync('build/static/js/main.1a2b3c.js', 'document.body.append("hello from cra-style");\n');
writeFileSync('build/index.html', '<!doctype html><html><head><title>CRA style</title></head><body><script src="/static/js/main.1a2b3c.js"></script></body></html>\n');
