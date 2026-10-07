import { Flower2, Gift, RotateCcw, Truck } from "lucide-react";
import { BRAND_PROMISES } from "@/config/site";

const ICONS = [Flower2, Gift, Truck, RotateCcw];

/** Bốn cam kết của shop (docs/05 mục 4). */
export function BrandPromise() {
  return (
    <section aria-label="Cam kết của Lamora" className="border-y border-sand-200 bg-ivory-100">
      <ul className="page-container grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        {BRAND_PROMISES.map((promise, index) => {
          const Icon = ICONS[index % ICONS.length] ?? Flower2;
          return (
            <li key={promise.title} className="flex flex-col items-start gap-3">
              <Icon aria-hidden strokeWidth={1.25} className="size-7 text-gold-500" />
              <h3 className="type-h3">{promise.title}</h3>
              <p className="type-small text-stone-500">{promise.description}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
