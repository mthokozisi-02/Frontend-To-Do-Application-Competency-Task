import type { ToDo } from "../types";

const STORAGE_KEY = "mock_todos_v1";

// simulate failure rate (0 = never fail, 0.1 = 10% fail)
const FAIL_RATE = 0.05;
const LATENCY_MIN = 400;
const LATENCY_MAX = 900;

function randomDelay() {
  const ms = Math.floor(Math.random() * (LATENCY_MAX - LATENCY_MIN)) + LATENCY_MIN;
  return new Promise((res) => setTimeout(res, ms));
}

function maybeFail() {
  if (Math.random() < FAIL_RATE) {
    throw new Error("Simulated network error");
  }
}

function loadFromStorage(): ToDo[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const sample: ToDo[] = [
      {
        id: cryptoRandomId(),
        title: "Buy groceries",
        description: "Milk, eggs, bread",
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: cryptoRandomId(),
        title: "Finish report",
        description: "Send by end of day",
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    return sample;
  }
  return JSON.parse(raw) as ToDo[];
}

function saveToStorage(todos: ToDo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function cryptoRandomId() {
  // simple unique id
  return (Math.random().toString(36).slice(2, 9) + Date.now().toString(36));
}

export const mockApi = {
  async fetchTodos(): Promise<ToDo[]> {
    await randomDelay();
    maybeFail();
    return loadFromStorage();
  },

  async createTodo(input: { title: string; description?: string }): Promise<ToDo> {
    await randomDelay();
    maybeFail();
    const todos = loadFromStorage();
    const newTodo: ToDo = {
      id: cryptoRandomId(),
      title: input.title,
      description: input.description ?? "",
      completed: false,
      createdAt: new Date().toISOString()
    };
    todos.unshift(newTodo);
    saveToStorage(todos);
    return newTodo;
  },

  async updateTodo(id: string, patch: Partial<Pick<ToDo, "title" | "description" | "completed">>): Promise<ToDo> {
    await randomDelay();
    maybeFail();
    const todos = loadFromStorage();
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Not found");
    const updated = { ...todos[idx], ...patch };
    todos[idx] = updated;
    saveToStorage(todos);
    return updated;
  },

  async deleteTodo(id: string): Promise<{ success: boolean }> {
    await randomDelay();
    maybeFail();
    const todos = loadFromStorage();
    const next = todos.filter((t) => t.id !== id);
    saveToStorage(next);
    return { success: true };
  }
};
