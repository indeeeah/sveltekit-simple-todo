<script>
	import { eventCodesCrossed } from "$lib/event_code";
	import { formatDate, formatPlaytime } from "$lib/formatDate";
	import { getEventIcon } from "$lib/game-icon";

    export let gameData;
    export let gameInfo;

    $: list = gameData ? gameData.list : [];
    $: lastEvent = list.length > 0 ? list[list.length - 1] : null;
    $: curValueEventData = lastEvent ? lastEvent.value_event_data : undefined;
    $: ball = {
        position: '50%',
        backgroundColor: 'rgb(254 240 138)'
    };

    let tabSet = 1;

    function switchTab(tab, date) {
        tabSet = tab;
    }

    function moveBall(position) {
        if (position === "L") {
            ball = { position: '20%', backgroundColor: 'rgb(254 202 202)' };
        } else if (position === "C") {
            ball = { position: '50%', backgroundColor: 'rgb(254 240 138)' };
        } else if (position === "R") {
            ball = { position: '80%', backgroundColor: 'rgb(191 219 254)' };
        }
    }

    $: {
        if (curValueEventData) {
            const eventData = curValueEventData.split(' ');
            if (eventData) {
                const position = eventData.find(e => e.startsWith('99=')).split('=')[1];
                moveBall(position);
            }
        }
    }
</script>

<div class="bg-gray-700 h-[800px] overflow-y-auto p-6 border-l border-gray-500">
    <div class="flex justify-center items-center font-bold text-md text-white w-full w-20 h-10 border-b border-gray-500">
        상세 경기 정보
    </div>
    {#if gameInfo && list.length > 0}
        <div class="h-12 w-full flex items-center mb-2 grid grid-cols-3">
            <span class="text-md font-bold text-white border-b-2 border-red-400 text-center">{gameInfo.team1}</span>
            <div class="flex flex-col items-center">
                <div class="h-5">
                    <span class="border border-gray-500 text-[10px] text-center bg-gray-600 text-gray-400 rounded-sm">{lastEvent.tickerstate} | {formatPlaytime(lastEvent.currentPlaytime)}</span>
                </div>
                <div class="flex flex gap-2 justify-center">
                    <span class="text-md font-bold text-white">{lastEvent.score_home}</span>
                    <span class="text-md font-bold text-white">:</span>
                    <span class="text-md font-bold text-white">{lastEvent.score_away}</span>
                </div>
            </div>
            <span class="text-md font-bold text-white border-b-2 border-blue-400 text-center">{gameInfo.team2}</span>
        </div>
        <div class="w-full h-4 mb-4 rounded-full flex overflow-hidden">
            <div
              class="bg-red-400"
              style="width: {gameData.recentStatistics['1063']}%;"
            ></div>
            <div
              class="bg-blue-400"
              style="width: {gameData.recentStatistics['2087']}%;"
            ></div>
        </div>
        <div class="relative bg-blue-300 mb-4 shadow-md flex flex-col justify-center items-center pt-12 pb-4 px-2">
            <div class="relative w-full h-[300px] bg-green-600 rounded-lg overflow-hidden shadow-md">
                <!-- Outer Boundary -->
                <div class="absolute inset-0 border-2 border-white rounded-lg"></div>
                <div class="absolute top-1 left-1/2 transform -translate-x-1/2 w-40 h-10 bg-gray-600 shadow-md flex items-center justify-center gap-1">
                    <span class="text-white font-bold">{lastEvent.tickerstate}</span>
                    <span class="text-[30px] text-white">|</span>
                    <span class="text-white font-bold">{formatPlaytime(lastEvent.currentPlaytime)}</span>
                </div>
                <!-- Center Circle -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full"></div>
                <!-- Midline -->
                <div class="absolute top-1/2 left-0 w-full h-0.5 bg-white"></div>
                <!-- Penalty Areas -->
                <div class="absolute left-0 top-1/4 w-28 h-1/2 border-2 border-white rounded-sm"></div>
                <div class="absolute right-0 top-1/4 w-28 h-1/2 border-2 border-white rounded-sm"></div>
                <!-- Goal Areas -->
                <div class="absolute left-0 top-[37.5%] w-16 h-1/4 border-2 border-white"></div>
                <div class="absolute right-0 top-[37.5%] w-16 h-1/4 border-2 border-white"></div>
                <!-- Goals -->
                <div class="absolute left-0 top-[42.5%] w-6 h-1/6 border-2 border-white rounded-e-sm"></div>
                <div class="absolute right-0 top-[42.5%] w-6 h-1/6 border-2 border-white rounded-s-sm"></div>
                <!-- Ball -->
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full opacity-70 shadow-md"
                    style="left: {ball.position}; background-color: {ball.backgroundColor};"
                ></div>
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full flex items-center justify-center p-4"
                    style="left: {ball.position};"
                >
                    <span class="font-bold text-white text-center text-lg bg-blue-500 px-2 rounded-lg">{lastEvent.event_code}</span>
                </div>
            </div>
            <div class="flex gap-4 mt-8">
                <button class='h-3 flex justify-center items-center' on:click={() => switchTab(0)}>
                    <div class={`h-1 w-16 rounded-sm ${tabSet === 0 ? 'bg-white' : 'bg-gray-400'}`}>{''}</div>
                </button>
                <button class='h-3 flex justify-center items-center' on:click={() => switchTab(1)}>
                    <div class={`h-1 w-16 rounded-sm ${tabSet === 1 ? 'bg-white' : 'bg-gray-400'}`}>{''}</div>
                </button>
            </div>
            <div class={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[340px] w-[400px] bg-gray-600 shadow-md p-4 ${tabSet === 0 ? 'hidden' : ''}`}>
                {#if tabSet === 1}
                    <div class="text-white font-bold text-md border-b border-gray-400 p-1">슛 통계</div>
                {/if}
            </div>
        </div>
        <div class="flex flex-col-reverse">
            {#each list as event}
                <div class="w-full border border-gray-500 bg-gray-600 mb-2">
                    <div class="h-10 flex items-center px-4 shadow-md">
                        <div class="text-white text-xs font-bold">
                            {formatDate(event.timestamp).timeWithSeconds}
                        </div>
                    </div>
                    <div class="h-16 flex items-center p-4 text-sm text-white gap-1">
                        <span>{getEventIcon(event.event_code_id) || ''}</span>
                        <span>{event.event_code}</span>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
    {#if gameInfo && list.length === 0}
        <div class="h-12 w-full flex items-center mb-2 grid grid-cols-3">
            <span class="text-md font-bold text-white border-b-2 border-red-400 text-center">{gameInfo.team1}</span>
            <div class="text-center">
                <div class="flex flex gap-2 justify-center">
                    <span class="text-xs font-bold text-gray-300">{gameInfo.date}</span>
                    <span class="text-xs font-bold text-white">{gameInfo.time}</span>
                </div>
            </div>
            <span class="text-md font-bold text-white border-b-2 border-blue-400 text-center">{gameInfo.team2}</span>
        </div>
        <div class="h-[650px] flex flex-col items-center justify-center">
            <span class="text-[35px] font-bold text-white mb-4">경기 예정</span>            
            <div class="flex flex gap-2">
                <span class="text-md font-bold text-gray-300">{gameInfo.date}</span>
                <span class="text-md font-bold text-white">{gameInfo.time}</span>
            </div>
        </div>
    {/if}
    {#if !gameInfo}
        <div class="h-[700px] flex items-center justify-center text-white font-bold text-lg">
            경기를 클릭해 상세 정보를 확인하세요
        </div>
    {/if}
</div>