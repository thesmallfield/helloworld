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
