import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-type": "application/json",
  },
});

export const getTodos = async function() {
    const response = await client.get('/todos')
    return response.data
}

export const createTodo = async function(todo: any) {
    todo.dueDate = todo.dueDate.toISOString()
    return client.post('/todos', todo)
}

export const updateTodo = async function(todo: any) {
    const { id, ...rest } = todo
    todo.dueDate = todo.dueDate.toISOString()
    return client.put(`/todos/${id}`, rest)
}

export const deleteTodo = async function(id: number) {
    return client.delete(`/todos/${id}`)
}
