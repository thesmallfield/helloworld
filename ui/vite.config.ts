import { defineConfig } from 'vite';

const strip = (name: string) => (path: string) => path.replace(new RegExp(`^/${name}`), '');

export default defineConfig({
    server: {
        proxy: {
            '/api1': { target: 'http://localhost:8081', rewrite: strip('api1') },
            '/api2': { target: 'http://localhost:8082', rewrite: strip('api2') },
        },
    },
});
