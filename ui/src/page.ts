import { SmallFieldError } from '@thesmallfield/web';

export function element<T extends HTMLElement>(id: string): T {
    const found = document.getElementById(id);
    if (!found) throw new Error(`#${id} is missing from index.html`);
    return found as T;
}

export function say(id: string, text: string, isError = false): void {
    const status = element(id);
    status.textContent = text;
    status.classList.toggle('error', isError);
}

export function plainEnglish(error: unknown): string {
    if (error instanceof SmallFieldError) {
        if (error.code === 'unauthorized') return 'Sign in first, then try again.';
        if (error.code === 'network') return 'Could not reach Small Field. Check your connection.';
        return error.message;
    }
    return 'Something went wrong. Try again.';
}
