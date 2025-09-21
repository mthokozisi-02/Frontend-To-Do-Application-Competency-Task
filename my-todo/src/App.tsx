import './App.css'
import { useEffect, useState, type JSX } from "react";
import type { ToDo } from "./types";
import { mockApi } from "./api/mockApi";
import ToDoList from "./components/ToDoList";
import AddToDoForm from "./components/AddToDoForm";

function App(): JSX.Element {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await mockApi.fetchTodos();
        setTodos(items);
      } catch (err) {
        setError((err as Error).message || "Failed to fetch todos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addTodo = async (title: string, description?: string) => {
    setSaving(true);
    setError(null);
    try {
      const created = await mockApi.createTodo({ title, description });
      setTodos((s) => [created, ...s]);
    } catch (err) {
      setError((err as Error).message || "Failed to add todo");
    } finally {
      setSaving(false);
    }
  };

  const updateTodo = async (id: string, patch: Partial<Pick<ToDo, "title" | "description" | "completed">>) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await mockApi.updateTodo(id, patch);
      setTodos((s) => s.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError((err as Error).message || "Failed to update todo");
    } finally {
      setSaving(false);
    }
  };

  const deleteTodo = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await mockApi.deleteTodo(id);
      setTodos((s) => s.filter((t) => t.id !== id));
    } catch (err) {
      setError((err as Error).message || "Failed to delete todo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>To-Do App</h1>
        <p className="sub">React + TypeScript — Mock API with latency</p>
      </header>

      <main>
        <AddToDoForm onAdd={addTodo} disabled={saving} />
        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loader">Loading todos...</div>
        ) : (
          <ToDoList
            todos={todos}
            onToggleCompleted={(t) => updateTodo(t.id, { completed: !t.completed })}
            onDelete={(t) => deleteTodo(t.id)}
            onUpdate={(t, patch) => updateTodo(t.id, patch)}
            saving={saving}
          />
        )}
      </main>

      <footer className="footer">
        <small>Mock API latency simulated. Data saved in localStorage.</small>
      </footer>
    </div>
  );
}

export default App;
