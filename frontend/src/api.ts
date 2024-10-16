import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-type": "application/json",
  },
});

client.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

export const getTodos = async function() {
    const response = await client.get('/todos')
    return response.data
}

export const createTodo = async function(todo: any) {
    return client.post('/todos', todo)
}

export const updateTodo = async function(todo: any) {
    const { id, _createdAt, _updatedAt, ...body } = todo
    return client.put(`/todos/${id}`, body)
}

export const deleteTodo = async function(id: number) {
    return client.delete(`/todos/${id}`)
}

export const signup = async function({username, password}: {username: string, password: string}) {
    return client.post('/users', { user: { username, password } })
}

export const login = async function({ username, password}: {username: string, password: string}) {
    return client.post('/auth/login', { username, password })
}
