"use client";

import TextForm from "@/components/ui/TextForm";
import Button from "@/components/ui/Button";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const id = formData.get("id");
    const password = formData.get("password");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      document.cookie = `token=${token}; path=/; max-age=86400`;
      router.push("/");
    } else {
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg gap-4"
    >
      <h1 className="w-full font-bold">Admin Login</h1>
      <TextForm
        label="아이디"
        type="text"
        name="id"
        placeholder="아이디를 입력하세요."
        required
      />
      <TextForm
        label="비밀번호"
        type="password"
        name="password"
        placeholder="비밀번호를 입력하세요."
        required
      />
      <Button name="로그인" type="submit" />
    </form>
  );
}
