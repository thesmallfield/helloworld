import type { IncomingMessage } from 'node:http';
import type { Person } from '@thesmallfield/node';
import { describe, expect, it } from 'vitest';
import { health, whoami } from '../src/whoami.js';

const req = {} as IncomingMessage;
const signedIn = (person: Person | null) => ({ fromRequest: async () => person });
const ada: Person = {
    id: 'u1',
    email: 'ada@example.com',
    name: 'Ada',
    role: 'admin',
    roles: ['admin', 'editor'],
    scopes: [],
};

describe('api1 routes', () => {
    it('/health answers ok without anyone signed in', () => {
        expect(health()).toEqual({ status: 200, body: { status: 'ok' } });
    });

    it('/whoami returns the email and roles of the signed-in person', async () => {
        expect(await whoami(req, signedIn(ada))).toEqual({
            status: 200,
            body: { email: 'ada@example.com', roles: ['admin', 'editor'] },
        });
    });

    it('/whoami answers 401 when nobody is signed in', async () => {
        expect((await whoami(req, signedIn(null))).status).toBe(401);
    });

    it('/whoami answers 503 without Small Field settings', async () => {
        expect((await whoami(req, undefined)).status).toBe(503);
    });
});
