"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { useCoursesBySubject } from "@/hooks/query/useCoursesBySubject";
import { useSetBatchCourse } from "@/hooks/mutations/useSetBatchCourse";
import { extractApiError } from "@/lib/utils/apiError";
import type { Batch } from "@/types/batch";

const NO_COURSE_VALUE = "__none__";

interface BatchCourseModalProps {
  batch: Batch;
  onClose: () => void;
}

export function BatchCourseModal({ batch, onClose }: BatchCourseModalProps) {
  const { data: courses } = useCoursesBySubject(batch.subject_id);
  const setBatchCourse = useSetBatchCourse();

  const [selected, setSelected] = useState(batch.course_id ?? NO_COURSE_VALUE);

  const handleSave = () => {
    const courseId = selected === NO_COURSE_VALUE ? null : selected;
    setBatchCourse.mutate(
      { batchId: batch.id, courseId },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal open onClose={onClose} title="Course" widthClassName="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="batch-course"
            className="font-display text-[12.5px] font-bold text-ink-2"
          >
            Course for {batch.subject_name}
          </label>
          <select
            id="batch-course"
            name="batch-course"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow"
          >
            <option value={NO_COURSE_VALUE}>No course linked</option>
            {batch.course_id && !courses?.some((c) => c.id === batch.course_id) ? (
              <option value={batch.course_id}>{batch.course_title}</option>
            ) : null}
            {courses?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          {!courses || courses.length === 0 ? (
            <p className="m-0 text-xs text-muted">
              Course listing isn&apos;t wired up in this app yet — you can
              still clear a linked course above.
            </p>
          ) : null}
        </div>

        <FormError
          message={
            setBatchCourse.isError
              ? extractApiError(setBatchCourse.error)
              : undefined
          }
        />

        <Button
          onClick={handleSave}
          isLoading={setBatchCourse.isPending}
          className="w-full"
        >
          {setBatchCourse.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
    </Modal>
  );
}
