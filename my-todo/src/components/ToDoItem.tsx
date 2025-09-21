import { useState } from "react";
import type { ToDo } from "../types";

interface Props {
  todo: ToDo;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (patch: Partial<Pick<ToDo, "title" | "description">>) => void;
  saving?: boolean;
}

export default function ToDoItem({ todo, onToggle, onDelete, onUpdate, saving }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [desc, setDesc] = useState(todo.description ?? "");
  const [localError, setLocalError] = useState<string | null>(null);

  const save = async () => {
    setLocalError(null);
    if (!title.trim()) {
      setLocalError("Title cannot be empty");
      return;
    }
    await onUpdate({ title: title.trim(), description: desc.trim() });
    setEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="left">
        <input
          id={`chk-${todo.id}`}
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          disabled={saving}
        />
      </div>

      <div className="middle">
        {editing ? (
          <>
            <input className="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={saving} />
            <textarea className="edit-desc" value={desc} onChange={(e) => setDesc(e.target.value)} disabled={saving} />
            {localError && <div className="error small">{localError}</div>}
          </>
        ) : (
          <>
            <label htmlFor={`chk-${todo.id}`} className="title">{todo.title}</label>
            {todo.description && <div className="desc">{todo.description}</div>}
            <div className="meta">Created: {new Date(todo.createdAt).toLocaleString()}</div>
          </>
        )}
      </div>

      <div className="right">
        {editing ? (
          <>
            <button className="btn small" onClick={save} disabled={saving}>Save</button>
            <button className="btn small ghost" onClick={() => { setEditing(false); setTitle(todo.title); setDesc(todo.description ?? ""); }} disabled={saving}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn small" onClick={() => setEditing(true)} disabled={saving}>Edit</button>
            <button className="btn small danger" onClick={() => { if (confirm("Delete this to-do?")) onDelete(); }} disabled={saving}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
