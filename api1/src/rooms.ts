import type { IncomingMessage } from 'node:http';
import { SmallFieldError } from '@thesmallfield/node';
import { smallField, type Reply } from './email.js';

const NOT_SET = { status: 503, body: { error: 'Small Field settings are missing for api1.' } };

function refused(error: unknown): Reply {
    if (error instanceof SmallFieldError) {
        return { status: 502, body: { error: error.message } };
    }
    throw error;
}

export async function roomsOrders(req: IncomingMessage): Promise<Reply> {
    const sf = smallField();
    if (!sf) {
        return NOT_SET;
    }
    try {
        const rooms = sf.as(req).apps('rooms', { scope: 'orders.read' });
        return { status: 200, body: await rooms.fetch('/api/orders') };
    } catch (error) {
        return refused(error);
    }
}

export async function roomsReportStart(): Promise<Reply> {
    const sf = smallField();
    if (!sf) {
        return NOT_SET;
    }
    try {
        const run = await sf.apps('rooms', { scope: 'report' }).jobs.run('report');
        return { status: 202, body: run };
    } catch (error) {
        return refused(error);
    }
}

export async function roomsReportStatus(runId: string): Promise<Reply> {
    const sf = smallField();
    if (!sf) {
        return NOT_SET;
    }
    try {
        const run = await sf
            .apps('rooms', { scope: 'report' })
            .jobs.status({ runId, job: 'report' });
        return { status: 200, body: { status: run.status, log: run.log } };
    } catch (error) {
        return refused(error);
    }
}
