export type ResourceKind =
  | "past_paper"
  | "mark_scheme"
  | "class_notes"
  | "worksheet"
  | "formula_sheet"
  | "slides"
  | "other";

/** ResourceItemResponse — a downloadable file attached to a recording or batch. */
export interface ResourceItem {
  id: string;
  kind: ResourceKind;
  title: string;
  url: string;
  file_type: string;
  created_at: string;
}

/** Local form values for the resource upload form (file handled separately). */
export interface ResourceFormValues {
  title: string;
  kind: ResourceKind;
}
