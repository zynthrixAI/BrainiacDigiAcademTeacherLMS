import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { ROUTES } from "@/lib/constants";
import type { Batch } from "@/types/batch";

interface BatchCardProps {
  batch: Batch;
}

export function BatchCard({ batch }: BatchCardProps) {
  return (
    <Link
      href={`${ROUTES.batches}/${batch.id}`}
      className="group flex flex-col rounded-[14px] border border-line bg-bg-elev p-5 shadow-[0_1px_2px_rgba(28,27,27,0.03)] transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-md bg-[#f5f5f4] px-2 py-0.5 text-[11px] font-bold text-ink-2">
          {batch.subject_name}
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
            batch.is_published
              ? "bg-[#ecfdf5] text-green"
              : "bg-[#f5f5f4] text-muted"
          }`}
        >
          {batch.is_published ? "Published" : "Draft"}
        </span>
      </div>

      <h3 className="mt-3 font-display text-base font-extrabold text-ink">
        {batch.name}
      </h3>
      {batch.description ? (
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {batch.description}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <div className="flex items-center gap-4 text-xs text-muted">
          <span>
            <span className="font-bold text-ink">{batch.enrolled_count}</span>{" "}
            enrolled
          </span>
          <span>
            <span className="font-bold text-ink">
              Rs. {batch.price.toLocaleString()}
            </span>
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-yellow-ink">
          Classes <ArrowRightIcon size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
