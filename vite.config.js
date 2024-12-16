import { createWSSGlobalInstance, onHttpServerUpgrade } from './src/lib/server/web-socket-util';
import { sveltekit } from '@sveltejs/kit/vite';
import { configDotenv } from 'dotenv';
import { defineConfig } from 'vite';


configDotenv();

export default defineConfig({
	plugins: [sveltekit(), 
		{
			name: 'integratedWebsocketServer',
			configureServer(server) {
				createWSSGlobalInstance();
				server.httpServer.on('upgrade', onHttpServerUpgrade);
			},
			configurePreviewServer(server) {
				createWSSGlobalInstance();
				server.httpServer.on('upgrade', onHttpServerUpgrade);
			}
		}
	]
});
