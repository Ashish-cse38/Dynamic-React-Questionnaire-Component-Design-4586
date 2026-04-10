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

/** Definition of a single form field. */
export interface FieldConfig {
  /** Unique identifier — used as the key in FormData. */
  name: string;
  /** Display label rendered above the input. */
  label: string;
  /** Input type — controls which HTML element is rendered. */
  type: FieldType;
  /**
   * Must exactly match one of the stage names in QuestionnaireConfig.stages.
   * Determines which step the field appears on.
   */
  stage: string;
  /** If true, the field must be non-empty before the user can advance. */
  required?: boolean;
  /** Placeholder text — applies to text, email, number, and textarea types. */
  placeholder?: string;
  /**
   * Option list — required for radio, checkbox, and select types.
   * Ignored for all other types.
   */
  options?: string[];
}

// ---------------------------------------------------------------------------
// Questionnaire Config
// ---------------------------------------------------------------------------

/** Top-level configuration object passed to <Questionnaire />. */
export interface QuestionnaireConfig {
  /** Ordered list of stage names. Each name becomes one step in the progress bar. */
  stages: string[];
  /**
   * All field definitions across all stages.
   * Each field's `stage` property must match a value in `stages`.
   */
  fields: FieldConfig[];
}

// ---------------------------------------------------------------------------
// Form Data
// ---------------------------------------------------------------------------

/**
 * The collected form values passed to onSubmit.
 * - Text-like fields → string
 * - Checkbox fields  → string[]
 */
export type FormData = Record<string, string | string[]>;

// ---------------------------------------------------------------------------
// Component Props
// ---------------------------------------------------------------------------

/** Props for the top-level <Questionnaire /> component. */
export interface QuestionnaireProps {
  /** The form configuration object. */
  config: QuestionnaireConfig;
  /**
   * Callback fired with the collected FormData on final-stage submission.
   * Defaults to console.log if omitted.
   */
  onSubmit?: (formData: FormData) => void;
}

/** Props for the <FieldRenderer /> component. */
export interface FieldRendererProps {
  /** A single field config object. */
  field: FieldConfig;
  /** Current controlled value for this field. */
  value: string | string[];
  /**
   * Change handler — called with (fieldName, newValue) on every change.
   * newValue is string[] only for checkbox fields.
   */
  onChange: (name: string, value: string | string[]) => void;
  /** Validation error message displayed below the field. */
  error?: string;
}

/** Props for the <ProgressBar /> component. */
export interface ProgressBarProps {
  /** Ordered array of stage names. */
  stages: string[];
  /** Zero-based index of the currently active stage. */
  currentStageIndex: number;
}

// ---------------------------------------------------------------------------
// Internal helpers (not exported from index)
// ---------------------------------------------------------------------------

/** Internal validation errors map — keyed by field name. */
export type ValidationErrors = Record<string, string>;