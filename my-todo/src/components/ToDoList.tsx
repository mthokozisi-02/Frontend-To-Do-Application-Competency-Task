import type { ToDo } from "../types";
import ToDoItem from "./ToDoItem";

interface Props {
  todos: ToDo[];
  onToggleCompleted: (todo: ToDo) => void;
  onDelete: (todo: ToDo) => void;
  onUpdate: (todo: ToDo, patch: Partial<Pick<ToDo, "title" | "description">>) => void;
  saving?: boolean;
}

export default function ToDoList({ todos, onToggleCompleted, onDelete, onUpdate, saving }: Props) {
  if (todos.length === 0) {
    return <div className="empty">No to-dos yet. Add one above!</div>;
  }

  return (
    <ul className="todo-list">
      {todos.map((t) => (
        <li key={t.id}>
          <ToDoItem
            todo={t}
            onToggle={() => onToggleCompleted(t)}
            onDelete={() => onDelete(t)}
            onUpdate={(patch: any) => onUpdate(t, patch)}
            saving={saving}
          />
        </li>
      ))}
    </ul>
  );
}
