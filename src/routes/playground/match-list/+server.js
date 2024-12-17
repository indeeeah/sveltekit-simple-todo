import { json } from '@sveltejs/kit';
import socketManager from '../../../lib/socket-manager';

export async function POST() {
    try {
        socketManager.requestMatchList();
        return json({ status: 'success', message: 'Request match list' });
    } catch (error) {
        console.error('Failed to get match list: ', error);
        return json({ status: 'error', message: 'Failed to get match list' });
    }
}