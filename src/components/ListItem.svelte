<script>
	import { eventsStore } from "../store";

    export let match;
    export let getGameEvents;
    export let event;

    $: lastEvent = event ? event.slice(-1)[0] : null;
</script>

<button class="w-full mb-2" on:click={() => getGameEvents(match.matchid)}>
    <div class="h-10 flex items-center px-4 gap-2">
        <span class="text-xs">{match.sportIcon}</span>
        <span class="text-white text-xs font-bold">{match.league}</span>
    </div>
    <div class="border border-gray-500 bg-gray-600">
        <div class="h-10 flex items-center px-4 shadow-md justify-between">
            <div class="flex gap-2">
                <span class="text-gray-300 text-xs font-bold">{match.date}</span>
                <span class="text-white text-xs font-bold">{match.time}</span>
                {#if new Date(match.timestamp) < new Date()}
                    <span class="text-gray-600 text-xs font-bold bg-yellow-400 rounded-full px-2 shadow-md">🚩 경기 중</span>
                {/if}
            </div>
            <span class="text-gray-300 text-xs font-bold">{match.stadium}</span>
        </div>
        <div class="h-32 py-4 px-6 flex flex-col justify-center">
            <div class="flex items-center justify-center w-full mb-2">
                <div class="grid grid-cols-3 gap-4 w-full items-center">
                    <span class="text-white text-[20px] font-bold text-center">{match.team1}</span>
                    <div class="flex flex-col items-center gap-2">
                        <div class="flex gap-4 justify-center">
                            <span class="text-white text-[35px] font-bold">{lastEvent ? lastEvent.score_home : '-'}</span>
                            <span class="text-white text-[35px] font-bold">:</span>
                            <span class="text-white text-[35px] font-bold">{lastEvent ? lastEvent.score_away : '-'}</span>
                        </div>
                        <div class="text-gray-200 text-xs">{lastEvent ? lastEvent.event_code : '경기 전'}</div>
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