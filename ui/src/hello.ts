export async function showHello(name: string): Promise<void> {
    const element = document.getElementById(name);
    if (!element) return;
    try {
        const response = await fetch(`/${name}/hello`);
        if (!response.ok) throw new Error(String(response.status));
        const { message } = await response.json();
        element.textContent = `${name} says: ${message}`;
    } catch {
        element.textContent = `${name}: unreachable`;
    }
}

export async function showWhoami(): Promise<void> {
    const element = document.getElementById('whoami');
    if (!element) return;
    try {
        const response = await fetch('/api1/whoami');
        const body = await response.json();
        element.textContent = response.ok
            ? `api1 sees ${body.email} with roles: ${body.roles.join(', ') || 'none'}`
            : `api1: ${body.error ?? response.status}`;
    } catch {
        element.textContent = 'api1: unreachable';
    }
}
