import { useState } from 'react';
import { ADD } from '../../util/icons';

export default function NewTextInput ({
  label,
  onAdd,
  disabled
}: {
  label: string;
  onAdd: (item: string) => void;
  disabled?: boolean
})  {
  const [newItem, setNewItem] = useState("");
  const addItem = () => {
    const value = newItem.trim();
    if (!value) return;
    onAdd(value);
    setNewItem("");
  };
  return (
    <div className="flex space-x-4">
      <input
        type="text"
        value={newItem}
        disabled={disabled}
        onChange={(e) => setNewItem(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addItem();
          }
        }}
        placeholder={`Add new ${label.toLowerCase().slice(0, -1)}`}
        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={addItem}
        disabled={disabled}
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-none"
      >
        {ADD}
      </button>
    </div>
  );
};
