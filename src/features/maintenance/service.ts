import * as repo from "./repository";

const DAY_MS = 24 * 60 * 60 * 1000;
/** Giới hạn tần suất dài nhất chỉ 10 phút; giữ 1 ngày là dư để đối soát khi cần. */
const RATE_LIMIT_KEEP_DAYS = 1;
const IP_HASH_KEEP_DAYS = 90;

export type CleanupResult = { rateLimitHitsDeleted: number; ipHashesCleared: number };

/** Dọn dẹp hằng ngày (docs/09 mục 7): bộ đếm giới hạn tần suất cũ và `ipHash` quá 90 ngày. */
export async function runCleanup(now: Date = new Date()): Promise<CleanupResult> {
  const [rateLimitHitsDeleted, ipHashesCleared] = await Promise.all([
    repo.deleteRateLimitHitsBefore(new Date(now.getTime() - RATE_LIMIT_KEEP_DAYS * DAY_MS)),
    repo.clearOrderIpHashBefore(new Date(now.getTime() - IP_HASH_KEEP_DAYS * DAY_MS)),
  ]);
  return { rateLimitHitsDeleted, ipHashesCleared };
}
