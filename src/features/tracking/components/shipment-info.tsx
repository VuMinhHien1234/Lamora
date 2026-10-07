/** Đơn vị vận chuyển + mã vận đơn (chỉ hiện khi shop đã nhập). */
export function ShipmentInfo({
  carrier,
  trackingCode,
}: {
  carrier: string | null;
  trackingCode: string | null;
}) {
  if (!carrier && !trackingCode) return null;
  return (
    <section aria-label="Vận chuyển" className="border border-sand-200 p-5">
      <h2 className="type-h3 mb-3">Vận chuyển</h2>
      <dl className="type-body flex flex-col gap-1">
        {carrier && (
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Đơn vị vận chuyển</dt>
            <dd>{carrier}</dd>
          </div>
        )}
        {trackingCode && (
          <div className="flex justify-between gap-4">
            <dt className="text-stone-500">Mã vận đơn</dt>
            <dd className="tabular-nums">{trackingCode}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
