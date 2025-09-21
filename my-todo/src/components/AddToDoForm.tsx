import React, { useState } from "react";

interface Props {
  onAdd: (title: string, description?: string) => Promise<void> | void;
  disabled?: boolean;
}

export default function AddToDoForm({ onAdd, disabled }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!title.trim()) {
      setLocalError("Title is required");
      return;
    }
    await onAdd(title.trim(), desc.trim() || undefined);
    setTitle("");
    setDesc("");
  };

  return (
    <form className="add-form" onSubmit={submit}>
      <div className="row">
        <input
          className="input"
          placeholder="Add a new to-do (title required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disabled}
        />
        <button className="btn" type="submit" disabled={disabled}>
          Add
        </button>
      </div>
      <textarea
        className="textarea"
        placeholder="Optional description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        disabled={disabled}
      />
      {localError && <div className="error small">{localError}</div>}
    </form>
  );
}
