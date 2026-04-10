"use client";

interface MediaUrlInputProps {
  value: string;
  onChange: (v: string) => void;
  onInsert: () => void;
  onCancel: () => void;
  placeholder: string;
}

export function MediaUrlInput({
  value,
  onChange,
  onInsert,
  onCancel,
  placeholder,
}: MediaUrlInputProps) {
  return (
    <div className="flex gap-2 mb-3">
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onInsert();
          }
        }}
        placeholder={placeholder}
        autoFocus
        className="flex-1 h-8 px-2 text-body-sm border border-muted-300 rounded-sm bg-surface focus:outline-none focus:border-primary-400 transition-colors"
      />
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          onInsert();
        }}
        className="h-8 px-3 text-caption bg-primary-900 text-white rounded-sm hover:bg-primary-800 transition-colors"
      >
        Insert
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="h-8 px-2 text-caption text-secondary-500 hover:text-primary-900 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
