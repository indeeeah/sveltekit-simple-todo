// web-socket-uti.js
import { nanoid } from "nanoid";
import { WebSocketServer } from "ws";
import socketManager from "../socket-manager"

export const GlobalThisWSS = Symbol.for('sveltekit.wss');

export const onHttpServerUpgrade = (req, sock, head) => {
    const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
    if (pathname !== '/websocket') return;

    const wss = globalThis[GlobalThisWSS];

    wss.handleUpgrade(req, sock, head, (ws) => {
        console.log('[handleUpgrade] creating new connection');
        wss.emit('connection', ws, req);
    });
};

export const createWSSGlobalInstance = () => {
    const wss = new WebSocketServer({ noServer: true });

    global.wss = wss;
    globalThis[GlobalThisWSS] = wss;

    wss.on('connection', (ws) => {
        ws.socketId = nanoid();
        console.log(`[wss:global] client connected (${ws.socketId})`);

        // socketManager 인스턴스 직접 출력
        console.log('socketManager 인스턴스:', socketManager);
        
        // 클라이언트 배열 직접 출력
        console.log('웹소켓 클라이언트 배열:', socketManager.webSocketClients);

        ws.on('message', (message) => {
            console.log(`클라이언트 ${ws.socketId}로부터 메시지 수신:`, message);
        });

        ws.on('close', () => {
            console.log(`[wss:global] client disconnected (${ws.socketId})`);
        });
    });

    return wss;
};