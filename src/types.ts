// ---------------------------------------------------------------------------
// Field Types
// ---------------------------------------------------------------------------
/** All supported input types for a questionnaire field. */
export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox';

// ---------------------------------------------------------------------------
// Field Config
// ---------------------------------------------------------------------------
/** Definition of a single form field within a questionnaire stage. */
export interface FieldConfig {
  /** Unique identifier — used as the key in {@link FormData}. */
  name: string;
  /** Human-readable label rendered above the input element. */
  label: string;
  /**
   * Controls which HTML element is rendered.
   * Must be one of the values in {@link FieldType}.
   */
  type: FieldType;
  /**
   * The stage this field belongs to.
   * Must exactly match one of the strings in {@link QuestionnaireConfig.stages}.
   */
  stage: string;
  /**
   * When `true`, the field must have a non-empty value before
   * the user can advance to the next stage.
   * @default false
   */
  required?: boolean;
  /**
   * Placeholder text shown inside the input.
   * Only applied to `text`, `email`, `number`, and `textarea` types.
   */
  placeholder?: string;
  /**
   * Selectable options list.
   * **Required** for `radio`, `checkbox`, and `select` types.
   * Ignored for all other types.
   */
  options?: string[];
}

// ---------------------------------------------------------------------------
// Questionnaire Config
// ---------------------------------------------------------------------------
/**
 * Top-level configuration object consumed by {@link QuestionnaireProps}.
 * Fully describes the form structure without any JSX.
 */
export interface QuestionnaireConfig {
  /**
   * Ordered list of stage names.
   * Each entry creates one step in the progress bar.
   */
  stages: string[];
  /**
   * All field definitions across every stage.
   * Each field's `stage` property must match a value in `stages`.
   */
  fields: FieldConfig[];
  /**
   * Primary heading displayed at the top of the questionnaire.
   * Falls back to `"Questionnaire"` when omitted.
   */
  mainHeading?: string;
  /**
   * Subtitle / description rendered below the main heading.
   * Falls back to `"Fill out the information below to proceed."` when omitted.
   */
  subHeading?: string;
  /**
   * Heading rendered above the fields of the currently active stage.
   * When provided, replaces the default stage-name label.
   * Supports a `{stage}` token that is replaced with the current stage name at runtime.
   * @example "Tell us about: {stage}"
   */
  stageHeading?: string;
  /**
   * Description rendered below the stage heading for the currently active stage.
   * Supports a `{stage}` token that is replaced with the current stage name at runtime.
   * @example "Please complete all fields for the {stage} section."
   */
  stageDescription?: string;
}

// ---------------------------------------------------------------------------
// Form Data
// ---------------------------------------------------------------------------
/**
 * Collected form values passed to {@link QuestionnaireProps.onSubmit}.
 *
 * - **Text-like fields** (`text`, `email`, `number`, `textarea`, `select`, `radio`) → `string`
 * - **Checkbox fields** → `string[]`
 */
export type FormData = Record<string, string | string[]>;

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------
/** Props accepted by the top-level `<Questionnaire />` component. */
export interface QuestionnaireProps {
  /** The complete form configuration object. */
  config: QuestionnaireConfig;
  /**
   * Called with the collected {@link FormData} when the user submits the final stage.
   * Falls back to `console.log` when omitted.
   */
  onSubmit?: (formData: FormData) => void;
}

/** Props accepted by the `<FieldRenderer />` component. */
export interface FieldRendererProps {
  /** The field definition to render. */
  field: FieldConfig;
  /**
   * Current controlled value for this field.
   * `string[]` only for `checkbox` fields; `string` for everything else.
   */
  value: string | string[];
  /**
   * Fired on every change with `(fieldName, newValue)`.
   * `newValue` is `string[]` only for `checkbox` fields.
   */
  onChange: (name: string, value: string | string[]) => void;
  /** Validation error message rendered below the input when present. */
  error?: string;
}

/** Props accepted by the `<ProgressBar />` component. */
export interface ProgressBarProps {
  /** Ordered array of stage name strings. */
  stages: string[];
  /** Zero-based index of the currently active stage. */
  currentStageIndex: number;
}

// ---------------------------------------------------------------------------
// Internal helpers (not re-exported from src/index.ts)
// ---------------------------------------------------------------------------
/**
 * Map of field names to their validation error messages.
 * Used internally by `<Questionnaire />` — not part of the public API.
 */
export type ValidationErrors = Record<string, string>;