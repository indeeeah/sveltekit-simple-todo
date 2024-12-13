import { writable } from "svelte/store"

let todos = [
    { id: 1, text: "Learn Svelte", done: true, date: '2024-12-12' },
    { id: 2, text: "Learn Sapper", done: false, date: '2024-12-12' },
    { id: 3, text: "Build something awesome", done: false, date: '2024-12-11' },
    { id: 4, text: "Learn TypeScript", done: false, date: "2024-12-13" }
]

export const todosStore = writable(todos)