"use client";

import { Modal } from "@/components/ui/Modal";
import { FormError } from "@/components/ui/FormError";
import { useLiveClassAttendance } from "@/hooks/query/useLiveClassAttendance";
import { extractApiError } from "@/lib/utils/apiError";
import type { AttendanceStatus } from "@/types/attendance";

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-[#ecfdf5] text-green",
  late: "bg-[#fef3c7] text-[#92400e]",
  absent: "bg-[#fef2f2] text-red",
};

interface AttendanceModalProps {
  liveClassId: string | null;
  onClose: () => void;
}

export function AttendanceModal({ liveClassId, onClose }: AttendanceModalProps) {
  const open = liveClassId !== null;
  const { data, isLoading, isError, error } = useLiveClassAttendance(
    liveClassId ?? "",
    open,
  );

  return (
    <Modal open={open} onClose={onClose} title="Attendance" widthClassName="max-w-lg">
      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted">Loading attendance…</p>
      ) : isError ? (
        <FormError message={extractApiError(error)} />
      ) : data ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Total", value: data.total, className: "text-ink" },
              { label: "Present", value: data.present, className: "text-green" },
              { label: "Late", value: data.late, className: "text-[#92400e]" },
              { label: "Absent", value: data.absent, className: "text-red" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-line bg-[#faf9f7] p-3 text-center"
              >
                <div className={`font-display text-xl font-extrabold ${stat.className}`}>
                  {stat.value}
                </div>
                <div className="text-[11px] text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {data.records.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              No attendance records yet.
            </p>
          ) : (
            <ul className="flex flex-col">
              {data.records.map((record) => (
                <li
                  key={record.id}
                  className="flex items-center justify-between gap-3 border-b border-line py-2.5 last:border-b-0"
                >
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-[13px] font-bold text-ink">
                      {record.student_name}
                    </span>
                    <span className="truncate text-xs text-muted">
                      {record.student_email}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold capitalize ${STATUS_STYLES[record.status]}`}
                  >
                    {record.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </Modal>
  );
}
