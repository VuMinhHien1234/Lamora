type ClassValue = string | false | null | undefined;

/** Ghép class có điều kiện: cn("a", isOn && "b") → "a b". */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
