import React from "react";

type SubmitProps = {
  name: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ name, ...props }: SubmitProps) {
  return <button>{name}</button>;
}
