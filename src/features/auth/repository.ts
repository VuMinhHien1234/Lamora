import { db } from "@/lib/db";

export async function markPasswordChanged(userId: string): Promise<void> {
  await db.user.update({ where: { id: userId }, data: { mustChangePassword: false } });
}
