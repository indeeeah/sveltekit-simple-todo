<script>
	import { onDestroy } from "svelte";

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


  // 날짜 포맷 함수 (timestamp 변환)
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
</script>

<main class="flex flex-col items-center justify-center h-full -mt-14">
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
    <h1 class="text-2xl font-bold mb-4 text-center">Match Information</h1>
  <div class="overflow-hidden shadow-md rounded-lg bg-white">
    <table class="table-auto w-full text-left border-collapse">
      <thead class="bg-gray-200">
        <tr>
          <th class="text-xs px-1 text-gray-600">Match ID</th>
          <th class="text-xs px-1 text-gray-600">Date</th>
          <th class="text-xs px-1 text-gray-600">Teams</th>
          <th class="text-xs px-1 text-gray-600">League</th>
          <th class="text-xs px-1 text-gray-600">Countries</th>
          <th class="text-xs px-1 text-gray-600">Stadium</th>
          <th class="text-xs px-1 text-gray-600">Coverage</th>
          <th class="text-xs px-1 text-gray-600">Play State</th>
          <th class="text-xs px-1 text-gray-600">Sport</th>
          <th class="text-xs px-1 text-gray-600">Half-Time Duration</th>
          <th class="text-xs px-1 text-gray-600">Overtime Duration</th>
          <th class="text-xs px-1 text-gray-600">Home Advantage</th>
        </tr>
      </thead>
      <tbody>
        {#each matchData as match}
            <tr class="bg-gray-50">
            <td class="text-xs px-1 text-gray-600">{match.matchid}</td>
            <td class="text-xs px-1 text-gray-600">{formatDate(match.timestamp)}</td>
            <td class="text-xs px-1 text-gray-600">{match.team1} vs {match.team2}</td>
            <td class="text-xs px-1 text-gray-600">{match.league}</td>
            <td class="text-xs px-1 text-gray-600">{match.country1} vs {match.country2}</td>
            <td class="text-xs px-1 text-gray-600">{match.stadium}</td>
            <td class="text-xs px-1 text-gray-600">{match.coverage}</td>
            <td class="text-xs px-1 text-gray-600">{match.playstate}</td>
            <td class="text-xs px-1 text-gray-600">{match.sportname}</td>
            <td class="text-xs px-1 text-gray-600">{match.league_halftime_duration} mins</td>
            <td class="text-xs px-1 text-gray-600">{match.league_overtime_duration} mins</td>
            <td class="text-xs px-1 text-gray-600">{matchData.homeAdvantage}</td>
            </tr>
        {/each}
      </tbody>
    </table>
  </div>
</main>