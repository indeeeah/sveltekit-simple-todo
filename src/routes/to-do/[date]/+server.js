import { json } from "@sveltejs/kit";
import { Redis } from "ioredis";

const redis = new Redis();

export async function POST({ request, params }) {
    const { date }  = params;
    const { id, text, done } = await request.json();

    let todos = await redis.get(`to-do:${date}`);
    todos = todos ? JSON.parse(todos) : [];

    todos.push({ id, text, done, deleted: false });

    await redis.set(`to-do:${date}`, JSON.stringify(todos));

    return json({
        status: 201,
        body: todos.filter(todo => !todo.deleted)
    });
}

export async function PUT({ request, params }) {
    const { date }  = params;
    const { id, text, done } = await request.json();

    let todos = await redis.get(`to-do:${date}`);
    todos = todos ? JSON.parse(todos) : [];

    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, text, done };
        }

        return todo;
    });

    await redis.set(`to-do:${date}`, JSON.stringify(todos));

    return json({
        status: 200,
        body: todos.filter(todo => !todo.deleted)
    });
}

export async function DELETE({ params, request }) {
    const { date }  = params;
    const { id } = await request.json();

    let todos = await redis.get(`to-do:${date}`);
    todos = todos ? JSON.parse(todos) : [];
    todos = todos.filter(todo => todo.id !== id);

    await redis.set(`to-do:${date}`, JSON.stringify(todos));

    return json({
        status: 200,
        body: todos.filter(todo => !todo.deleted)
    });
}
