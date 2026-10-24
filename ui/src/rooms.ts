import type { SmallFieldClient } from '@thesmallfield/web';
import { element, say } from './page.js';

const POLL_MS = 2000;

function messageOf(error: unknown): string {
    if (error instanceof Error && !(error instanceof TypeError)) return error.message;
    return 'Could not reach rooms. Try again.';
}

function show(data: unknown): void {
    element('rooms-result').textContent =
        typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

function wire(buttonId: string, action: () => Promise<unknown>): void {
    const button = element<HTMLButtonElement>(buttonId);
    button.addEventListener('click', async () => {
        button.disabled = true;
        say('rooms-status', 'Asking rooms…');
        try {
            show(await action());
            say('rooms-status', 'Done.');
        } catch (error) {
            show('');
            say('rooms-status', messageOf(error), true);
        } finally {
            button.disabled = false;
        }
    });
}

async function api1(path: string, method = 'GET'): Promise<any> {
    const response = await fetch(`/api1${path}`, { method });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error ?? `api1 answered ${response.status}.`);
    return body;
}

async function runReport(): Promise<unknown> {
    const { runId } = await api1('/report', 'POST');
    for (;;) {
        const run = await api1(`/report/${runId}`);
        if (run.status !== 'queued' && run.status !== 'running') return `${run.status}\n${run.log}`;
        say('rooms-status', `Report is ${run.status}…`);
        await new Promise((done) => setTimeout(done, POLL_MS));
    }
}

export function setUpRooms(sf: SmallFieldClient): void {
    wire('rooms-backend', () => api1('/orders'));
    wire('rooms-direct', () => sf.apps('rooms', { scope: 'orders.read' }).fetch('/api/orders'));
    wire('rooms-report', runReport);
}
