import { createServer, type IncomingMessage } from 'node:http';
import { sendMeEmail, type Reply } from './email.js';
import { Notes } from './notes.js';
import { roomsOrders, roomsReportStart, roomsReportStatus } from './rooms.js';

const SERVICE = 'api1';
const MAX_BODY_BYTES = 10_000;
const MAX_TEXT_CHARS = 1_000;
const port = Number(process.env.PORT ?? 8080);
const databaseUrl = process.env.DATABASE_URL;
const notes = databaseUrl ? await Notes.open(databaseUrl) : null;

async function readText(req: IncomingMessage): Promise<string> {
    let body = '';
    for await (const chunk of req) {
        body += chunk;
        if (body.length > MAX_BODY_BYTES) {
            throw new Error('body too large');
        }
    }
    return body;
}

async function addNote(store: Notes, req: IncomingMessage): Promise<Reply> {
    let text: unknown;
    try {
        text = JSON.parse(await readText(req)).text;
    } catch {
        text = undefined;
    }
    if (typeof text !== 'string' || text.trim() === '' || text.length > MAX_TEXT_CHARS) {
        return { status: 400, body: { error: 'Send JSON like {"text":"first"}.' } };
    }
    return { status: 201, body: await store.add(text) };
}

async function route(req: IncomingMessage): Promise<Reply> {
    if (req.method === 'GET' && req.url === '/hello') {
        return { status: 200, body: { service: SERVICE, message: `hello from ${SERVICE}` } };
    }
    if (req.method === 'POST' && req.url === '/email') {
        return sendMeEmail(req);
    }
    if (req.method === 'GET' && req.url === '/orders') {
        return roomsOrders(req);
    }
    if (req.method === 'POST' && req.url === '/report') {
        return roomsReportStart();
    }
    const runId =
        req.method === 'GET' ? /^\/report\/([\w-]+)$/.exec(req.url ?? '')?.[1] : undefined;
    if (runId) {
        return roomsReportStatus(runId);
    }
    if (req.url !== '/notes') {
        return { status: 404, body: { error: 'not found' } };
    }
    if (!notes) {
        return { status: 503, body: { error: 'No database configured' } };
    }
    if (req.method === 'GET') {
        return { status: 200, body: await notes.list() };
    }
    if (req.method === 'POST') {
        return addNote(notes, req);
    }
    return { status: 405, body: { error: 'method not allowed' } };
}

createServer((req, res) => {
    const started = Date.now();
    route(req)
        .catch((error: unknown) => {
            process.stderr.write(`${String(error)}\n`);
            return { status: 500, body: { error: 'Something went wrong. Try again.' } };
        })
        .then(({ status, body }) => {
            res.writeHead(status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(body));
            process.stdout.write(`${req.method} ${req.url} ${status} ${Date.now() - started}ms\n`);
        });
}).listen(port);
