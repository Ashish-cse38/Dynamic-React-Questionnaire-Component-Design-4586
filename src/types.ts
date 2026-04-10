export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox';

export interface FieldConfig {
  /** Unique identifier — used as the key in formData */
  name: string;
  /** Display label rendered above the input */
  label: string;
  /** Input type */
  type: FieldType;
  /** Must exactly match one of the stage names in QuestionnaireConfig.stages */
  stage: string;
  /** If true, the field must be filled before the user can advance */
  required?: boolean;
  /** Placeholder text — applicable to text, email, number, textarea */
  placeholder?: string;
  /** Option list — required for radio, checkbox, and select types */
  options?: string[];
}

export interface QuestionnaireConfig {
  /** Ordered list of stage names */
  stages: string[];
  /** All field definitions across all stages */
  fields: FieldConfig[];
}

export type FormData = Record<string, string | string[]>;

export interface QuestionnaireProps {
  config: QuestionnaireConfig;
  /** Called with the collected formData on final-stage submission */
  onSubmit?: (formData: FormData) => void;
}

export interface FieldRendererProps {
  field: FieldConfig;
  value: string | string[];
  /** Called with (fieldName, newValue) on every change */
  onChange: (name: string, value: string | string[]) => void;
  /** Validation error message to display below the field */
  error?: string;
}

export interface ProgressBarProps {
  stages: string[];
  /** Zero-based index of the currently active stage */
  currentStageIndex: number;
}