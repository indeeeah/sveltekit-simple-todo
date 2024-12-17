<script>
    export let matchData;

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
            situation: '경기 중'
        }
    ];

    $: list = [...pastGame, ...convertMatchData(matchData)];

    let tabSet = 0;

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        
        const formattedDate = date.toLocaleString("ko-KR", {
            month: "2-digit",  // 월 (2자리)
            day: "2-digit",    // 일 (2자리)
            weekday: "short",   // 요일 (줄임말)
        });

        const formattedTime = date.toLocaleString("ko-KR", {
            hour: "2-digit",   // 시간 (2자리)
            minute: "2-digit", // 분 (2자리)
        });

        return {
            date: formattedDate,  // 예: "12/16(월)"
            time: formattedTime,  // 예: "08:55"
        };
    }

    function switchTab(tab) {
        tabSet = tab;
    }

    function getRandomNumber() {
        return (Math.random() * 20).toFixed(2);
    }

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
            score1: new Date(match.timestamp) > new Date() ? 0 : (Math.random() * 10).toFixed(0),
            score2: new Date(match.timestamp) > new Date() ? 0 : (Math.random() * 10).toFixed(0),
            situation: new Date(match.timestamp) > new Date() ? '경기 전' : '경기 중'
        }));
    }
</script>

<div class="bg-gray-700 h-[800px] overflow-y-auto p-6">
    <div class="h-10 flex gap-1 w-full">
        <button on:click={() => switchTab(0)} class={`flex justify-center items-center font-bold text-xs text-white h-full w-20 gap-4 ${tabSet === 0 ? 'border-b-2 border-yellow-200 hover:border-yellow-600' : ''} hover:text-gray-400`}>
            <span>전체</span>
            <span>{list.length}</span>
        </button>
        <button on:click={() => switchTab(1)} class={`flex justify-center items-center font-bold text-xs text-white h-full w-20 gap-4 ${tabSet === 1 ? 'border-b-2 border-yellow-200 hover:border-yellow-600' : ''} hover:text-gray-400`}>
            <span>진행중</span>
            <span>{pastGame.length}</span>
        </button>
    </div>
    {#if tabSet === 0}
        {#each list as match}
            <button class="w-full">
                <div class="h-10 flex items-center px-4">
                    <span class="text-white text-xs font-bold">#{match.matchid}</span>
                </div>
                <div class="border border-gray-500 bg-gray-600">
                    <div class="h-10 flex items-center px-4 shadow-md">
                        <div class="flex gap-2">
                            <span class="text-gray-300 text-xs font-bold">{match.date}</span>
                            <span class="text-white text-xs font-bold">{match.time}</span>
                        </div>
                    </div>
                    <div class="h-32 py-4 px-6 flex flex-col justify-center">
                        <div class="flex items-center justify-center w-full mb-2">
                            <div class="grid grid-cols-3 gap-4 w-full items-center">
                                <span class="text-white text-[20px] font-bold text-center">{match.team1}</span>
                                <div class="flex flex-col items-center gap-2">
                                    <div class="flex gap-4 justify-center">
                                        <span class="text-white text-[35px] font-bold">{match.score1}</span>
                                        <span class="text-white text-[35px] font-bold">:</span>
                                        <span class="text-white text-[35px] font-bold">{match.score2}</span>
                                    </div>
                                    <div class="text-gray-200 text-xs">{match.situation}</div>
                                </div>
                                <span class="text-white text-[20px] font-bold text-center">{match.team2}</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-gray-200 rounded-full w-full h-8 flex justify-between p-4 items-center">
                                <div class="font-bold text-xs text-gray-400">홈 승</div>
                                <div class="font-bold text-xs text-yellow-400">{match.bet1}</div>
                            </div>
                            <div class="bg-gray-200 rounded-full w-full h-8 flex justify-between p-4 items-center">
                                <div class="font-bold text-xs text-gray-400">무</div>
                                <div class="font-bold text-xs text-yellow-400">{match.bet2}</div>
                            </div>
                            <div class="bg-gray-200 rounded-full w-full h-8 flex justify-between p-4 items-center">
                                <div class="font-bold text-xs text-gray-400">원정 승</div>
                                <div class="font-bold text-xs text-yellow-400">{match.bet3}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        {/each}
    {/if}
    {#if tabSet === 1}
        {#each pastGame as match}
            <button class="w-full">
                <div class="h-10 flex items-center px-4">
                    <span class="text-white text-xs font-bold">#{match.matchid}</span>
                </div>
                <div class="border border-gray-500 bg-gray-600">
                    <div class="h-10 flex items-center px-4 shadow-md">
                        <div class="flex gap-2">
                            <span class="text-gray-300 text-xs font-bold">{match.date}</span>
                            <span class="text-white text-xs font-bold">{match.time}</span>
                        </div>
                    </div>
                    <div class="h-32 py-4 px-6 flex flex-col justify-center">
                        <div class="flex items-center justify-center w-full mb-2">
                            <div class="grid grid-cols-3 gap-4 w-full items-center">
                                <span class="text-white text-[20px] font-bold text-center">{match.team1}</span>
                                <div class="flex flex-col items-center gap-2">
                                    <div class="flex gap-4 justify-center">
                                        <span class="text-white text-[35px] font-bold">{match.score1}</span>
                                        <span class="text-white text-[35px] font-bold">:</span>
                                        <span class="text-white text-[35px] font-bold">{match.score2}</span>
                                    </div>
                                    <div class="text-gray-200 text-xs">{match.situation}</div>
                                </div>
                                <span class="text-white text-[20px] font-bold text-center">{match.team2}</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-gray-200 rounded-full w-full h-8 flex justify-between p-4 items-center">
                                <div class="font-bold text-xs text-gray-400">홈 승</div>
                                <div class="font-bold text-xs text-yellow-400">{match.bet1}</div>
                            </div>
                            <div class="bg-gray-200 rounded-full w-full h-8 flex justify-between p-4 items-center">
                                <div class="font-bold text-xs text-gray-400">무</div>
                                <div class="font-bold text-xs text-yellow-400">{match.bet2}</div>
                            </div>
                            <div class="bg-gray-200 rounded-full w-full h-8 flex justify-between p-4 items-center">
                                <div class="font-bold text-xs text-gray-400">원정 승</div>
                                <div class="font-bold text-xs text-yellow-400">{match.bet3}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        {/each}
    {/if}
</div>