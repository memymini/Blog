import { InputHTMLAttributes } from "react";

type Props = {
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function TextForm({ label, error, ...props }: Props) {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input
        {...props}
        className="focus:outline-none focus:ring-1 focus:ring-gray-400 h-10 w-70 rounded-sm bg-white text-sm px-2"
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
