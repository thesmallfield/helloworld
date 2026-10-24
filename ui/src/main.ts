import { createClient } from '@thesmallfield/web';
import { setUpEmail } from './email.js';
import { setUpFiles } from './files.js';
import { showHello } from './hello.js';
import { element, plainEnglish } from './page.js';
import { setUpRooms } from './rooms.js';

const sf = createClient();

async function showMe(): Promise<void> {
    const banner = element('me');
    try {
        const me = await sf.identity.me();
        if (me) {
            banner.textContent = `Signed in as ${me.name ?? me.email} (${me.email})`;
            return;
        }
        const signIn = document.createElement('button');
        signIn.textContent = 'Sign in';
        signIn.addEventListener('click', () => sf.signIn());
        banner.replaceChildren('You are not signed in. ', signIn);
    } catch (error) {
        banner.textContent = plainEnglish(error);
    }
}

void showMe();
void showHello('api1');
void showHello('api2');
setUpFiles(sf);
setUpEmail();
setUpRooms(sf);
