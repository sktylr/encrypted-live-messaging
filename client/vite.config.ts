import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        'process.env.VITE_APP_API_URL': JSON.stringify('http://localhost:8001'),
    },
    base: '/',
    plugins: [react(), nodePolyfills()],
    preview: {
        port: 5173,
        strictPort: true,
    },
    server: {
        port: 5173,
        strictPort: true,
        host: true,
        origin: 'http://0.0.0.0:5173',
    },
    envPrefix: 'VITE_APP_',
});
