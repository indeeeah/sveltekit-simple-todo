<script>
	import { formatDate } from "$lib/formatDate";
	import ListItem from "./ListItem.svelte";

    export let matchData;
    export let getGameEvents;
    export let events;

    $: eventData = $events;

    let tabSet = 0;

    $: curGames = matchData.filter(e => new Date(e.timestamp) <= new Date());
    $: dayList = [...new Set(matchData.map(e => formatDate(e.timestamp).date))];
    $: dayGames = dayGames = tabSet > 1 
		? matchData.filter(e => formatDate(e.timestamp).date === dayList[tabSet - 2])
		: [];

    function switchTab(tab, date) {
        tabSet = tab;
    }
</script>

<div class="bg-gray-700 h-[800px] overflow-y-auto p-6">
    <div class="h-10 flex gap-2 w-full overflow-x-auto whitespace-nowrap">
        <button on:click={() => switchTab(0)} class={`flex justify-center items-center font-bold text-xs text-white h-full w-20 gap-4 ${tabSet === 0 ? 'border-b-2 border-yellow-200 hover:border-yellow-600' : ''} hover:text-gray-400`}>
            <span>전체</span>
            <span class="bg-gray-500 rounded-full px-1">{matchData.length}</span>
        </button>
        <button on:click={() => switchTab(1)} class={`flex justify-center items-center font-bold text-xs text-white h-full w-20 gap-4 ${tabSet === 1 ? 'border-b-2 border-yellow-200 hover:border-yellow-600' : ''} hover:text-gray-400`}>
            <span>진행중</span>
            <span class="bg-gray-500 rounded-full px-1">{curGames.length}</span>
        </button>
        {#each dayList as day, index}
            <button on:click={() => switchTab(index + 2)} class={`flex justify-center items-center font-bold text-xs text-white h-full w-22 gap-2 ${tabSet === index + 2 ? 'border-b-2 border-yellow-200 hover:border-yellow-600' : ''} hover:text-gray-400`}>
                <span>{day}</span>
                <span class="bg-gray-500 rounded-full px-1">{matchData.filter(e => formatDate(e.timestamp).date === day).length}</span>
            </button>
        {/each}
    </div>
    {#if tabSet === 0}
        {#each matchData as match}
            <ListItem match={match} getGameEvents={getGameEvents} event={eventData[match.matchid]} />
        {/each}
    {/if}
    {#if tabSet === 1}
        {#each curGames as match}
            <ListItem match={match} getGameEvents={getGameEvents} event={eventData[match.matchid]} />
        {/each}
    {/if}
    {#if tabSet > 1}
        {#each dayGames as match}
            <ListItem match={match} getGameEvents={getGameEvents} event={eventData[match.matchid]} />
        {/each}
    {/if}
</div>