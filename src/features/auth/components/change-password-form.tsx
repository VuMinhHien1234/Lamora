"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { changePassword } from "../actions";
import { MIN_PASSWORD_LENGTH } from "../schema";

type FieldErrors = Record<string, string[]>;

function readForm(form: FormData): {
  currentPassword: string;
  newPassword: string;
  confirm: string;
} {
  return {
    currentPassword: String(form.get("currentPassword") ?? ""),
    newPassword: String(form.get("newPassword") ?? ""),
    confirm: String(form.get("confirmPassword") ?? ""),
  };
}

function useChangePassword() {
  const router = useRouter();
  const toast = useToast();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const formElement = event.currentTarget;
    const { currentPassword, newPassword, confirm } = readForm(new FormData(formElement));
    if (newPassword !== confirm) {
      setErrors({ confirmPassword: ["Hai mật khẩu mới chưa giống nhau"] });
      return;
    }
    setLoading(true);
    setErrors({});
    const result = await changePassword({ currentPassword, newPassword });
    setLoading(false);
    if (!result.ok) {
      setErrors(result.error.fieldErrors ?? { _form: [result.error.message] });
      return;
    }
    formElement.reset();
    toast("Đã đổi mật khẩu");
    router.replace("/admin");
    router.refresh();
  }

  return { errors, loading, onSubmit };
}

export function ChangePasswordForm() {
  const { errors, loading, onSubmit } = useChangePassword();
  return (
    <form onSubmit={onSubmit} className="flex max-w-md flex-col gap-5" noValidate>
      <Input
        label="Mật khẩu hiện tại"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        required
        error={errors.currentPassword?.[0]}
      />
      <Input
        label="Mật khẩu mới"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        required
        hint={`Ít nhất ${MIN_PASSWORD_LENGTH} ký tự`}
        error={errors.newPassword?.[0]}
      />
      <Input
        label="Nhập lại mật khẩu mới"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        error={errors.confirmPassword?.[0]}
      />
      {errors._form?.[0] && (
        <p role="alert" className="type-small text-error-700">
          {errors._form[0]}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        size="compact"
        loading={loading}
        className="self-start"
      >
        Đổi mật khẩu
      </Button>
    </form>
  );
}
