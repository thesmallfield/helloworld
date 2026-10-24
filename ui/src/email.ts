import { element, say } from './page.js';

export function setUpEmail(): void {
    const button = element<HTMLButtonElement>('email-button');
    button.addEventListener('click', async () => {
        button.disabled = true;
        say('email-status', 'Sending…');
        try {
            const response = await fetch('/api1/email', { method: 'POST' });
            const body = await response.json().catch(() => ({}));
            if (!response.ok) {
                say('email-status', body.error ?? `api1 answered ${response.status}.`, true);
                return;
            }
            say('email-status', `Sent. Check your inbox. MessageId: ${body.messageId}`);
        } catch {
            say('email-status', 'Could not reach api1. Try again.', true);
        } finally {
            button.disabled = false;
        }
    });
}
