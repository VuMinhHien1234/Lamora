"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const HTTP_TOO_MANY_REQUESTS = 429;
const GENERIC_ERROR = "Email hoặc mật khẩu không đúng.";

export function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError(undefined);
    const { error: failure } = await authClient.signIn.email({
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    });
    if (failure) {
      setError(failure.status === HTTP_TOO_MANY_REQUESTS ? failure.message : GENERIC_ERROR);
      setLoading(false);
      return;
    }
    // Tải lại hẳn trang để phiên đăng nhập mới có hiệu lực ngay (tránh chuyển trang nửa chừng).
    window.location.assign(next);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <Input label="Email" name="email" type="email" autoComplete="username" required />
      <Input
        label="Mật khẩu"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {error && (
        <p role="alert" className="type-small text-error-700">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Đăng nhập
      </Button>
    </form>
  );
}
