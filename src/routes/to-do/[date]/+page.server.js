import { Redis } from "ioredis";

const redis = new Redis();

export async function load({ params }) {
    const { date }  = params;

    const todoData = await redis.get(`to-do:${date}`);

    const todos = todoData ? JSON.parse(todoData) : []

    return {
        todos: todos.filter(todo => !todo.deleted)
    };
}
