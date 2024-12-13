<script>
    import { goto } from '$app/navigation'; // SvelteKit의 내비게이션 API
    import { page } from '$app/stores';
    import { CalendarDate } from '@internationalized/date';
    import LeftIcon from '$lib/icons/LeftIcon.svelte';
    import RightIcon from '$lib/icons/RightIcon.svelte';
	import { onMount } from 'svelte';

    let [year, month, day] = $page.params.date.split('-').map(Number);
    let date = new CalendarDate(year, month, day);

    $: todos = $page.data.todos;
    $: [year, month, day] = [date.year, date.month, date.day];

    let text = '';

    onMount(async () => {
        await fetchTodos();
    });

    async function fetchTodos() {
        const response = await fetch(`/to-do/${year}-${month}-${day}`);
        const data = await response.json();
        todos = data.todos;
    }

    async function addTodo() {
        if (!text) return;

        const newTodo = { id: Math.random(), text, done: false, date: `${year}-${month}-${day}` };

        const response = await fetch(`/to-do/${year}-${month}-${day}`, {
            method: 'POST',
            body: JSON.stringify(newTodo),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        todos = data.body;
        text = '';
    }

    async function switchDone(todo) {
        todo.done = !todo.done;

        const response = await fetch(`/to-do/${year}-${month}-${day}`, {
            method: 'PUT',
            body: JSON.stringify(todo),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        todos = data.body;
    }

    async function deleteTodo(todo) {
        const response = await fetch(`/to-do/${year}-${month}-${day}`, {
            method: 'DELETE',
            body: JSON.stringify({ id: todo.id }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        todos = data.body;
    }

    async function subtractDay() {
        date = date.subtract({ days: 1 });
        await goto(`/to-do/${date.toString()}`);
    }

    async function addDay() {
        date = date.add({ days: 1 });
        await goto(`/to-do/${date.toString()}`);
    }
</script>

<main class="flex flex-col items-center justify-center h-full -mt-14">
    <h3 class="text-[15px] font-bold pb-2">current is.. {year}.{month}</h3>
    <div class="flex gap-6">
        <button class="border rounded-full flex size-7 justify-center items-center" on:click={subtractDay}>
            <LeftIcon />
        </button>
        <h1 class="text-[60px] font-bold pb-6">{day}</h1>
        <button class="border rounded-full flex size-7 justify-center items-center" on:click={addDay}>
            <RightIcon />
        </button>
    </div>
    <h1 class="text-[40px] font-bold pb-6">To-do List</h1>
    <div class="flex flex-col">
        <div class="flex gap-4 pb-6">
            <input type="text" bind:value={text} class="input px-4" />
            <button on:click={addTodo} class="btn variant-filled">Add</button>
        </div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Task</th>
                    <th>Done</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {#each todos as todo}
                    <tr>
                        <td>{todo.text}</td>
                        <td class="text-center"><button on:click={() => switchDone(todo)} class="chip {todo.done ? 'variant-filled' : 'variant-soft'}">{todo.done ? 'Yes' : 'No'}</button></td>
                        <td><button on:click={() => deleteTodo(todo)} class="chip variant-soft">Delete</button></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</main>