<script>
	import { onDestroy, onMount } from "svelte";
	import List from "../../components/List.svelte";
	import { eventsStore, matchDataStore } from "../../store";
	import Live from "../../components/Live.svelte";
	import { formatDate } from "$lib/formatDate";

    let webSocketEstablished = false;
    let ws = null;

    let isLoggedIn = false;

    function getSportsEmoticon(sport) {
        let emoticon;
        switch (sport) {
            case "Soccer":
                emoticon = "⚽";  // 축구
                break;
            case "Basketball":
                emoticon = "🏀";  // 농구
                break;
            case "Tennis":
                emoticon = "🎾";  // 테니스
                break;
            case "Baseball":
                emoticon = "⚾";  // 야구
                break;
            case "Golf":
                emoticon = "🏌️‍♂️";  // 골프
                break;
            case "Rugby":
                emoticon = "🏉";  // 럭비
                break;
            case "Cricket":
                emoticon = "🏏";  // 크리켓
                break;
            case "Hockey":
                emoticon = "🏒";  // 아이스하키
                break;
            case "Boxing":
                emoticon = "🥊";  // 복싱
                break;
            case "Football":
                emoticon = "🏈";  // 미식축구
                break;
            case "Volleyball":
                emoticon = "🏐";  // 배구
                break;
            case "Cycling":
                emoticon = "🚴‍♂️";  // 사이클링
                break;
            default:
                emoticon = "🏅";  // 기본 이모티콘 (모든 스포츠가 아닌 경우)
                break;
        }
        return emoticon;
    }

    const pastGame = [
        {
            matchid: 2102549,
            date: formatDate('2024-12-16 08:00:00').date,
            time: formatDate('2024-12-16 08:00:00').time,
            team1: 'Test Team 1',
            team2: 'Test Team 2',
            bet1: (Math.random() * 20).toFixed(2),
            bet2: (Math.random() * 20).toFixed(2),
            bet3: (Math.random() * 20).toFixed(2),
            score1: 1,
            score2: 2,
            situation: '경기 중',
            timestamp: '2024-12-16 08:00:00',
            league: 'Euroleague Women, Europe',
            stadium: 'Arena Vodova',
            country: 'Czech Republic, France',
            sportname: 'Soccer',
            sportIcon: getSportsEmoticon('Soccer')
        }
    ];

    let list = [...pastGame];
    let gameData = [];
    let gameInfo = null;

    $: matchDataStore.subscribe((data) => {
        list = [...pastGame, ...convertMatchData(data)];
    });

    function convertMatchData(data) {
        return data.map(match => ({
            matchid: match.matchid,
            date: formatDate(match.timestamp).date,
            time: formatDate(match.timestamp).time, // 'time' 키가 두 번 선언되어 있어 수정
            team1: match.team1,
            team2: match.team2,
            bet1: (Math.random() * 20).toFixed(2),
            bet2: (Math.random() * 20).toFixed(2),
            bet3: (Math.random() * 20).toFixed(2),
            score1: new Date(match.timestamp) > new Date() ? '-' : (Math.random() * 10).toFixed(0),
            score2: new Date(match.timestamp) > new Date() ? '-' : (Math.random() * 10).toFixed(0),
            situation: new Date(match.timestamp) > new Date() ? '경기 전' : '경기 중',
            timestamp: match.timestamp,
            league: `${match.league}, ${match.league_country}`,
            stadium: match.stadium,
            country: `${match.country1}, ${match.country2}`,
            sportname: match.sportname,
            sportIcon: getSportsEmoticon(match.sportname)
        }));
    }

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
            });

            ws.addEventListener('close', event => {
                webSocketEstablished = false;
                console.log('웹소켓 연결 종료', event);

                isLoggedIn = false;
            });

            ws.addEventListener('message', event => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('메시지 수신:', data);

                    if (data.keep_alive) {
                        isLoggedIn = true;
                    }

                    if (data.match_list_response) {
                        matchDataStore.set(data.match_list_response.match);
                    }

                    if (data.event) {
                        const matchId = data.event[0].matchid;

                        eventsStore.update(events => {
                            if (!events[matchId]) {
                                events[matchId] = [];
                            }

                            events[matchId].push(data.event[0]);

                            return { ...events };
                        });
                    }
                } catch (error) {
                    console.error('메시지 파싱 오류:', error);
                }
            });

            ws.addEventListener('error', event => {
                console.error('웹소켓 에러:', event);
                isLoggedIn = false
            });

        } catch (error) {
            console.error('웹소켓 연결 실패:', error);
            webSocketEstablished = false;
            isLoggedIn = false;
        }
    };

    const login = async () => {
        try {
            const response = await fetch('/playground/connect', {
                method: "POST",
            });
            const data = await response.json();
            console.log('로그인 응답:', data);

            if (data.status === 'success') {
                isLoggedIn = true;
            }
        } catch (error) {
            isLoggedIn = false;

            console.error('로그인 실패:', error);
        }
    }

    const requestMatchList = async () => {
        try {
            const response = await fetch('/playground/match-list', {
                method: 'POST'
            });
            const data = await response.json();
            console.log('매치 리스트 응답:', data);
        } catch (error) {
            console.error('매치 리스트 요청 실패: ', error);
        }
    }

    const getGameEvents = (matchid) => {
        eventsStore.subscribe(events => {
            gameData = events[matchid] || [];
        });

        gameInfo = list.find(e => e.matchid === matchid) || {};
    };

    // 컴포넌트가 제거될 때 웹소켓 연결 정리
    onDestroy(() => {
        if (ws) {
            ws.close();
            isLoggedIn = false;
        }
    });

    // 통계 데이터를 Key=Value 형태로 변환
    function parseStatistics(statistics) {
        return statistics.map((stat) => {
            const [key, value] = stat.split("=");
            return { key, value };
        });
    }

    onMount(async () => {
        await establishWebSocket();
        await login();
        await requestMatchList();
    });
</script>

<main class="flex flex-col items-center justify-center h-full -mt-10">
    <div class="grid grid-cols-2 size-full">
        <List matchData={list} getGameEvents={getGameEvents} events={eventsStore} />
        <Live gameData={gameData} gameInfo={gameInfo} />
    </div>
    <!-- <div class="flex gap-4 mb-6">
        <button 
            disabled={webSocketEstablished} 
            on:click={establishWebSocket} 
            class="btn variant-filled {webSocketEstablished ? 'opacity-50' : ''}"
        >
            {webSocketEstablished ? '웹소켓 연결됨' : '웹소켓 연결하기'}
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
    </div> -->
</main>