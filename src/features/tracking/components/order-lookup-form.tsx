"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lookupOrder } from "../actions";

type FieldErrors = Record<string, string[]> | undefined;

type FieldsProps = {
  code: string;
  phone: string;
  onCode: (value: string) => void;
  onPhone: (value: string) => void;
  errors: FieldErrors;
};

function LookupFields({ code, phone, onCode, onPhone, errors }: FieldsProps) {
  return (
    <>
      <Input
        label="Mã đơn"
        required
        value={code}
        onChange={(e) => onCode(e.target.value)}
        placeholder="LMR-261005-K7QF"
        autoComplete="off"
        error={errors?.code?.[0]}
      />
      <Input
        label="Số điện thoại đặt hàng"
        required
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={(e) => onPhone(e.target.value)}
        placeholder="0912 345 678"
        autoComplete="tel"
        error={errors?.phone?.[0]}
      />
    </>
  );
}

/** Form tra cứu: mã đơn + số điện thoại. Khớp thì mở trang kết quả; sai thì chỉ báo một câu chung. */
export function OrderLookupForm({ defaultCode = "" }: { defaultCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(defaultCode);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>();
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent): void {
    event.preventDefault();
    setError(undefined);
    setFieldErrors(undefined);
    startTransition(async () => {
      const result = await lookupOrder({ code, phone });
      if (result.ok) {
        router.push(`/tra-cuu-don?ma=${encodeURIComponent(result.data.code)}`);
        router.refresh();
        return;
      }
      setError(result.error.message);
      setFieldErrors(result.error.fieldErrors);
    });
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <LookupFields
        code={code}
        phone={phone}
        onCode={setCode}
        onPhone={setPhone}
        errors={fieldErrors}
      />
      {error && !fieldErrors && (
        <p role="alert" className="type-small text-error-700">
          {error}
        </p>
      )}
      <Button type="submit" loading={pending}>
        Tra cứu
      </Button>
    </form>
  );
}
