import net from 'net';
import { GlobalThisWSS } from './server/web-socket-util';

class SocketManager {
    constructor() {
        this.tcpClient = null;
        this.buffer = ''
    }

    // TCP 연결 초기화
    connect(config) {
        if (this.tcpClient) {
            console.log('TCP client already connected');
            return;
        }

        this.tcpClient = new net.Socket();

        this.tcpClient.connect(config.port, config.host, () => {
            console.log('Connected to TCP server');
        });

        let buffer = '';
        this.tcpClient.on('data', (data) => {
            buffer += data.toString();

            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                const message = buffer.slice(0, newlineIndex);
                buffer = buffer.slice(newlineIndex + 1);

                if (message.trim()) {
                    try {
                        const parsedMessage = JSON.parse(message);
                        console.log('parsedMessage: ', JSON.stringify(parsedMessage));
                        this.broadcastToWebSocketClients(parsedMessage);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                }
            }
        })

        this.tcpClient.on('error', (err) => {
            console.error('TCP error:', err);
            this.notifyListeners();
        });

        this.tcpClient.on('close', () => {
            console.log('TCP connection closed');
            this.tcpClient = null;
            this.notifyListeners();
        });
    }

    login(config) {
        this.sendLoginMessage(config.credentials);
    }

    requestMatchList() {
        const now = Date.now();
        const oneDayInMs = 24 * 60 * 60 * 1000;
    
        const message = {
            match_list_request: {
                timestamp: now,
                date_from: now,
                date_to: now + oneDayInMs,
            },
        };

        this.sendMessage(message); // 메시지 전송
        console.log(`\n[Sent] Match List Request : ${JSON.stringify(message)}`);
    }

    // TCP 메시지 처리
    handleMessage(data) {
        try {
            let buffer = '';
            buffer += data.toString();

            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                const message = buffer.slice(0, newlineIndex);
                buffer = buffer.slice(newlineIndex + 1);

                if (message.trim()) {
                    try {
                        const parsedMessage = JSON.parse(message);
                        console.log('parsedMessage: ', JSON.stringify(parsedMessage));
                        this.broadcastToWebSocketClients(parsedMessage);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to parse TCP message:', error);
        }
    }

    // 웹소켓 클라이언트들에 메시지 전달
    broadcastToWebSocketClients(message) {
        console.log('브로드캐스트 시작');

        const wss = global.wss || globalThis[GlobalThisWSS];
    
        if (!wss) {
            console.warn('WebSocket 서버를 찾을 수 없습니다.');
            return;
        }

        console.log('현재 클라이언트 수:', wss.clients.size);

        wss.clients.forEach((client) => {
            try {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(message));
                    console.log(`클라이언트 ${client.socketId}에게 메시지 전송 성공`);
                }
            } catch (error) {
                console.error(`클라이언트 전송 실패:`, error);
            }
        });
    }

    // TCP 로그인 메시지 전송
    sendLoginMessage(credentials) {
        if (!this.tcpClient) {
            console.error('TCP client not connected');
            return;
        }

        const loginMessage = {
            login: {
                timestamp: Date.now(),
                bookmakerid: credentials.bookmakerid,
                key: credentials.key,
            },
        };
        this.tcpClient.write(JSON.stringify(loginMessage) + '\n');
        console.log('Login message sent:', loginMessage);
    }

    // 다른 API 요청을 처리
    sendMessage(message) {
        if (!this.tcpClient) {
            console.error('Cannot send message. Not connected.');
            return;
        }

        this.tcpClient.write(JSON.stringify(message) + '\n');
        console.log('Message sent:', message);
    }
}

const instance = new SocketManager();
export default instance;