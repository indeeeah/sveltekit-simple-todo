<script>
	import { onDestroy } from "svelte";
	import List from "../../components/List.svelte";

    let webSocketEstablished = false;
    let ws = null;
    let log = [];

    let isLoggedIn = false;

    const logEvent = (str) => {
        log = [...log, typeof str === 'string' ? str : JSON.stringify(str)];
    }

    let matchData = [];

    const establishWebSocket = () => {
        if (webSocketEstablished) return;
        console.log('웹소켓 연결 시도');

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/websocket`;
        
        try {
            ws = new WebSocket(wsUrl);
            
            ws.addEventListener('open', event => {
                webSocketEstablished = true;
                console.log('웹소켓 연결 성공');
                logEvent('웹소켓 연결 성공');
                
                // 연결 상태 확인을 위한 ping 전송
                setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'ping' }));
                    }
                }, 30000);
            });

            ws.addEventListener('close', event => {
                webSocketEstablished = false;
                console.log('웹소켓 연결 종료', event);
                logEvent(`웹소켓 연결 종료: ${event.reason}`);

                isLoggedIn = false;
                
                // 재연결 시도
                setTimeout(() => {
                    if (!webSocketEstablished) {
                        establishWebSocket();
                    }
                }, 5000);
            });

            ws.addEventListener('message', event => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('메시지 수신:', data);
                    logEvent(`수신된 메시지: ${JSON.stringify(data)}`);

                    if (data.keep_alive) {
                        isLoggedIn = true;
                    }

                    if (data.match_list_response) {
                        matchData = data.match_list_response.match;
                    }
                } catch (error) {
                    console.error('메시지 파싱 오류:', error);
                    logEvent(`메시지 파싱 오류: ${event.data}`);
                }
            });

            ws.addEventListener('error', event => {
                console.error('웹소켓 에러:', event);
                logEvent(`웹소켓 에러 발생`);

                isLoggedIn = false
            });

        } catch (error) {
            console.error('웹소켓 연결 실패:', error);
            logEvent(`웹소켓 연결 실패: ${error.message}`);
            webSocketEstablished = false;
            isLoggedIn = false;
        }
    };

    const requestData = async () => {
        try {
            const res = await fetch('/api/test');
            const data = await res.json();
            console.log('GET 요청 응답:', data);
            logEvent(`GET 응답: ${JSON.stringify(data)}`);
        } catch (error) {
            console.error('GET 요청 실패:', error);
            logEvent(`GET 요청 실패: ${error.message}`);
        }
    };

    const login = async () => {
        try {
            const response = await fetch('/playground/connect', {
                method: "POST",
            });
            const data = await response.json();
            console.log('로그인 응답:', data);
            logEvent(`로그인 응답: ${JSON.stringify(data)}`);

            if (data.status === 'success') {
                isLoggedIn = true;
            }
        } catch (error) {
            isLoggedIn = false;

            console.error('로그인 실패:', error);
            logEvent(`로그인 실패: ${error.message}`);
        }
    }

    const requestMatchList = async () => {
        try {
            const response = await fetch('/playground/match-list', {
                method: 'POST'
            });
            const data = await response.json();
            console.log('매치 리스트 응답:', data);
            logEvent(`매치 리스트 응답: ${JSON.stringify(data)}`);
        } catch (error) {
            console.error('매치 리스트 요청 실패: ', error);
            logEvent(`매치 리스트 요청 실패: ${error.message}`);
        }
    }

    // 컴포넌트가 제거될 때 웹소켓 연결 정리
    onDestroy(() => {
        if (ws) {
            ws.close();
            isLoggedIn = false;
        }
    });

    const eventData = {
        event: [
        {
            lineups: [],
            matchid: 2102549,
            event_number: 3,
            event_code_id: 524,
            timestamp: 1734339351121,
            event_code: "Jersey colours updated",
            minute: 0,
            tickerstate: "Not started",
            tickerstateid: 1,
            score_home: 0,
            score_away: 0,
            clears_event: [],
            related_events: [],
            related_event_codes: [],
            statistics: ["1063=50", "2087=50"],
            value_event_data: "16=-10027060 17=-10027060 18=-10027060 19=-10027060 20=0 15=26962 25=true",
            score: [],
            currentPlaytime: 0,
            clockRunning: false,
        },
        ],
        timestamp: 1734339356146,
        status: "event",
        saved_at: "2024-12-16T08:55:56.255Z",
    };

    // 날짜 포맷 함수
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        });
    }

    // 통계 데이터를 Key=Value 형태로 변환
    function parseStatistics(statistics) {
        return statistics.map((stat) => {
        const [key, value] = stat.split("=");
        return { key, value };
        });
    }

    const matchEvent = eventData.event[0];
</script>

<main class="flex flex-col items-center justify-center h-full -mt-10">
    <div class="grid grid-cols-2 size-full">
        <List matchData={matchData} />
        <div class="bg-red-200"></div>
    </div>
    <div class="flex gap-4 mb-6">
        <button 
            disabled={webSocketEstablished} 
            on:click={establishWebSocket} 
            class="btn variant-filled {webSocketEstablished ? 'opacity-50' : ''}"
        >
            {webSocketEstablished ? '웹소켓 연결됨' : '웹소켓 연결하기'}
        </button>
        <button 
            on:click={requestData} 
            class="btn variant-filled"
        >
            데이터 요청
        </button>
        <button 
            disabled={isLoggedIn}
            on:click={login} 
            class="btn variant-filled"
        >
            로그인
        </button>
        <button class="btn variant-filled" disabled={!isLoggedIn} on:click={requestMatchList}>
            리스트 받아오기
        </button>
    </div>
    <h1 class="text-[50px] font-bold pb-6">Playground</h1>
    <!-- <div class="mt-4 max-h-[400px] overflow-y-auto">
        <ul class="space-y-2">
            {#each log as event}
                <li class="text-sm">{event}</li>
            {/each}
        </ul>
    </div> -->
    <!-- 카드 형식으로 데이터 표시 -->
    <h1 class="text-2xl font-bold text-center mb-4">Match Event Details</h1>
    <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div class="font-semibold text-gray-800">{matchEvent.matchid} #{matchEvent.event_number}</div>
        <h2 class="text-xl font-bold mb-2 text-center">Home {matchEvent.score_home} : Away {matchEvent.score_away}</h2>
        <div class="text-gray-600">{matchEvent.event_code}</div>
        <div class="text-gray-600">{formatDate(matchEvent.timestamp)}</div>
    </div>
</main>