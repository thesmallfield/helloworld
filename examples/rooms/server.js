import { createServer } from 'node:http';
import { bookings } from './bookings.js';

// The gate already verified this token before the request reached the app, so only the claims are read here.
function emailOf(req) {
    const token = req.headers['x-smallfield-token'];
    if (typeof token !== 'string') return null;
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString()).email ?? null;
    } catch {
        return null;
    }
}

function send(res, status, body) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
}

createServer((req, res) => {
    const { pathname } = new URL(req.url, 'http://rooms');
    if (req.method === 'GET' && pathname === '/api/orders') {
        const email = emailOf(req);
        const caller = req.headers['x-smallfield-caller'];
        const mine = email ? bookings.filter((b) => b.person === email) : bookings;
        return send(res, 200, { for: email ?? `machine call from ${caller}`, orders: mine });
    }
    send(res, 404, { error: 'not found' });
}).listen(Number(process.env.PORT ?? 8080));
