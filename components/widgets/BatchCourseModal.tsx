"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { useCoursesForBatch } from "@/hooks/query/useCoursesForBatch";
import { useSetBatchCourse } from "@/hooks/mutations/useSetBatchCourse";
import { extractApiError } from "@/lib/utils/apiError";
import type { Batch } from "@/types/batch";

const NO_COURSE_VALUE = "__none__";

interface BatchCourseModalProps {
  batch: Batch;
  onClose: () => void;
}

export function BatchCourseModal({ batch, onClose }: BatchCourseModalProps) {
  const coursesQuery = useCoursesForBatch(batch.id);
  const courses = coursesQuery.data;
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
            disabled={coursesQuery.isLoading}
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-yellow disabled:cursor-wait disabled:opacity-60"
          >
            <option value={NO_COURSE_VALUE}>No course linked</option>
            {/* Keep the currently linked course selectable even if it's
                missing from the list (e.g. since unpublished). */}
            {batch.course_id && !courses?.some((c) => c.id === batch.course_id) ? (
              <option value={batch.course_id}>{batch.course_title}</option>
            ) : null}
            {courses?.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
          {coursesQuery.isLoading ? (
            <p className="m-0 text-xs text-muted">Loading courses…</p>
          ) : coursesQuery.isError ? (
            <p className="m-0 text-xs text-red">
              {extractApiError(coursesQuery.error, "Couldn't load courses.")}
            </p>
          ) : courses && courses.length === 0 ? (
            <p className="m-0 text-xs text-muted">
              No published courses for this subject yet.
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
