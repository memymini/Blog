"use client";

import { Button } from "@/components/ui/Button";

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
      <Button
        variant="primary"
        size="sm"
        onMouseDown={(e) => {
          e.preventDefault();
          onInsert();
        }}
      >
        Insert
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="px-2 text-secondary-500 hover:text-primary-900"
      >
        ✕
      </Button>
    </div>
  );
}
