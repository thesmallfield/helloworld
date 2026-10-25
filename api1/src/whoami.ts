import type { IncomingMessage } from 'node:http';
import type { SmallFieldClient } from '@thesmallfield/node';
import type { Reply } from './email.js';

type Identity = Pick<SmallFieldClient['identity'], 'fromRequest'>;

export function health(): Reply {
    return { status: 200, body: { status: 'ok' } };
}

export async function whoami(req: IncomingMessage, identity: Identity | undefined): Promise<Reply> {
    if (!identity) {
        return { status: 503, body: { error: 'Small Field settings are missing for api1.' } };
    }
    const person = await identity.fromRequest(req);
    if (!person) {
        return { status: 401, body: { error: 'Sign in first.' } };
    }
    return { status: 200, body: { email: person.email, roles: person.roles } };
}
