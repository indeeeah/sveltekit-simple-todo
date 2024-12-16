import { json } from '@sveltejs/kit';
import socketManager from '../../../lib/socket-manager.js';
import { env } from '$env/dynamic/private';

const config = {
    host: env.ST_HOST,
    port: env.ST_PORT,
    credentials: {
        bookmakerid: env.ST_BOOKMAKERID,
        key: env.ST_KEY,
    },
};

export async function POST() {
    try {
        socketManager.connect(config);
        return json({ status: 'success', message: 'Connected to TCP server' });
    } catch (error) {
        console.error('Connection failed:', error);
        return json({ status: 'error', message: 'Failed to connect to TCP server' });
    }
}