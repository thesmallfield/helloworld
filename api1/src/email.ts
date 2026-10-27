import type { IncomingMessage } from 'node:http';
import { createClient, SmallFieldError, type SmallFieldClient } from '@thesmallfield/node';

export interface Reply {
    status: number;
    body: unknown;
}

const EMAIL_OFF =
    'The email service is off for this project. Turn on Email under Capabilities and redeploy.';

let client: SmallFieldClient | null = null;

const names: { env: string } = JSON.parse(process.env.PLATFORM_NAMES ?? '{"env":"SMALLFIELD"}');

// A deploy hands api1 its platform settings when Email, Files or Uses (other apps) is on.
export function smallField(): SmallFieldClient | null {
    if (!process.env[`${names.env}_API_URL`]) {
        return null;
    }
    client ??= createClient();
    return client;
}

export async function sendMeEmail(req: IncomingMessage): Promise<Reply> {
    const sf = smallField();
    if (!sf) {
        return { status: 503, body: { error: EMAIL_OFF } };
    }
    try {
        const { MessageId } = await sf.as(req).email.send({
            Content: {
                Simple: {
                    Subject: { Data: 'Hello from helloworld' },
                    Body: {
                        Text: { Data: 'This email was sent by api1 with @thesmallfield/node.' },
                        Html: {
                            Data: '<p>This email was sent by <b>api1</b> with <code>@thesmallfield/node</code>.</p>',
                        },
                    },
                },
            },
        });
        return { status: 200, body: { messageId: MessageId } };
    } catch (error) {
        if (error instanceof SmallFieldError) {
            return { status: error.status || 502, body: { error: error.message } };
        }
        throw error;
    }
}
