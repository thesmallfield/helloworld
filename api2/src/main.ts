import { createServer } from 'node:http';

const SERVICE = 'api2';
const port = Number(process.env.PORT ?? 8080);

function send(status: number, body: object): { status: number; payload: string } {
    return { status, payload: JSON.stringify(body) };
}

createServer((req, res) => {
    const started = Date.now();
    const found = req.method === 'GET' && req.url === '/hello';
    const { status, payload } = found
        ? send(200, { service: SERVICE, message: `hello from ${SERVICE}` })
        : send(404, { error: 'not found' });
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(payload);
    process.stdout.write(`${req.method} ${req.url} ${status} ${Date.now() - started}ms\n`);
}).listen(port);
