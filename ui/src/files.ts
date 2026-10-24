import type { FileEntry, SmallFieldClient } from '@thesmallfield/web';
import { element, plainEnglish, say } from './page.js';

export function setUpFiles(sf: SmallFieldClient): void {
    const input = element<HTMLInputElement>('file-input');
    const progress = element<HTMLProgressElement>('upload-progress');
    const search = element<HTMLInputElement>('search-input');

    async function refresh(): Promise<void> {
        say('files-status', 'Loading…');
        try {
            const q = search.value.trim();
            const { files } = await sf.files.search({ owner: 'me', ...(q ? { q } : {}) });
            element('file-list').replaceChildren(...files.map((file) => row(sf, file, refresh)));
            say('files-status', files.length ? '' : 'No files yet.');
        } catch (error) {
            say('files-status', plainEnglish(error), true);
        }
    }

    input.addEventListener('change', async () => {
        const file = input.files?.[0];
        if (!file) return;
        input.disabled = true;
        progress.hidden = false;
        progress.value = 0;
        say('upload-status', `Uploading ${file.name}…`);
        try {
            const upload = sf.files.upload(file, {
                onProgress: (sent, total) => (progress.value = total ? sent / total : 0),
            });
            const stored = await upload.promise;
            say('upload-status', `Uploaded ${stored.fileName}.`);
            await refresh();
        } catch (error) {
            say('upload-status', plainEnglish(error), true);
        } finally {
            input.disabled = false;
            input.value = '';
            progress.hidden = true;
        }
    });

    element('search-form').addEventListener('submit', (event) => {
        event.preventDefault();
        void refresh();
    });

    void refresh();
}

function row(sf: SmallFieldClient, file: FileEntry, refresh: () => Promise<void>): HTMLLIElement {
    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = `${file.fileName} (${sizeOf(file.sizeBytes)})`;

    const download = button('Download', async () => {
        const { url } = await sf.files.link(file.id);
        location.assign(url);
    });
    const remove = button('Delete', async () => {
        if (!confirm(`Delete ${file.fileName}?`)) return;
        await sf.files.remove(file.id);
        await refresh();
    });

    const item = document.createElement('li');
    item.append(name, download, remove);
    return item;
}

function button(label: string, action: () => Promise<void>): HTMLButtonElement {
    const created = document.createElement('button');
    created.type = 'button';
    created.textContent = label;
    created.addEventListener('click', () => {
        action().catch((error: unknown) => say('files-status', plainEnglish(error), true));
    });
    return created;
}

function sizeOf(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}
