import { defineConfig } from 'vite';
import { resolve } from 'path'


export default defineConfig(({ command, mode }) => {
    return {
        resolve: {
            alias: {
                'babylonjs': mode === 'development' ? 'babylonjs/babylon.max' : 'babylonjs',
                src: resolve(__dirname, './src'),
            }
        },
        server: {
            port: 5173,
            hmr: true,
        },
        optimizeDeps: { exclude: ['recast-navigation'] },
        css: {
            postcss: './postcss.config.js',
        },
        worker: {
            format: 'es',
        },
    };
});
