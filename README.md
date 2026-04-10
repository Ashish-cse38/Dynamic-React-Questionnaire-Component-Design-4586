# questionnaire-react

[![npm version](https://img.shields.io/npm/v/questionnaire-react.svg)](https://www.npmjs.com/package/questionnaire-react)
[![license](https://img.shields.io/npm/l/questionnaire-react.svg)](./LICENSE)
[![peer: react >=18](https://img.shields.io/badge/peer%20dep-react%20%3E%3D18-blue)](https://reactjs.org)

A dynamic, JSON-driven multi-step questionnaire component for React. Build fully functional multi-stage forms with built-in validation, smooth animations, and a clean progress indicator — all configured through a single JSON object. Zero form boilerplate.

---

## Installation

```bash
npm install questionnaire-react
```

> **Peer Dependencies** — your project must have `react` and `react-dom` installed:

```bash
npm install react react-dom
```

Supported peer versions: `react >= 18.0.0 < 20`, `react-dom >= 18.0.0 < 20`

---

## Quick Start

```jsx
import React from 'react';
import { Questionnaire } from 'questionnaire-react';

const config = {
  stages: ['Personal Info', 'Feedback'],
  fields: [
    {
      name: 'user_name',
      label: 'What is your full name?',
      type: 'text',
      required: true,
      stage: 'Personal Info',
      placeholder: 'e.g. John Doe',
    },
    {
      name: 'satisfaction',
      label: 'How satisfied are you?',
      type: 'radio',
      required: true,
      stage: 'Feedback',
      options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
    },
  ],
};

function App() {
  return (
    <Questionnaire
      config={config}
      onSubmit={(formData) => console.log('Submitted:', formData)}
    />
  );
}

export default App;
```

---

## Exports

| Export | Type | Description |
|---|---|---|
| `Questionnaire` | Component | Main multi-step form component |
| `FieldRenderer` | Component | Renders a single field — useful for custom layouts |
| `ProgressBar` | Component | Stage progress indicator |
| `formConfig` | Object | Built-in sample config as a starting template |

**TypeScript types also exported:**

| Type | Description |
|---|---|
| `QuestionnaireConfig` | Shape of the `config` prop |
| `FieldConfig` | Shape of a single field object |
| `FieldType` | Union of all supported field type strings |
| `QuestionnaireProps` | Props for `<Questionnaire />` |
| `FieldRendererProps` | Props for `<FieldRenderer />` |
| `ProgressBarProps` | Props for `<ProgressBar />` |
| `FormData` | Shape of the object passed to `onSubmit` |

```ts
import {
  Questionnaire,
  FieldRenderer,
  ProgressBar,
  formConfig,
} from 'questionnaire-react';

import type {
  QuestionnaireConfig,
  FieldConfig,
  FieldType,
  FormData,
} from 'questionnaire-react';
```

---

## `<Questionnaire />`

The primary component. Handles stage navigation, per-stage validation, and submission.

### Props

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `config` | `QuestionnaireConfig` | ✅ | — | The form configuration object |
| `onSubmit` | `(data: FormData) => void` | ❌ | `console.log` | Callback fired on final submission |

```jsx
<Questionnaire
  config={config}
  onSubmit={(formData) => fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(formData),
  })}
/>
```

---

## Config Object

```ts
interface QuestionnaireConfig {
  stages: string[];       // Ordered list of stage names
  fields: FieldConfig[];  // All field definitions across all stages
}
```

### `stages`

An ordered array of stage name strings. Each entry becomes one step in the progress bar.

```js
stages: ['Personal Info', 'Preferences', 'Feedback']
```

> **Important:** every field's `stage` property must exactly match one of these strings.

---

## Field Object (`FieldConfig`)

```ts
interface FieldConfig {
  name:        string;     // Unique key — appears in formData
  label:       string;     // Displayed above the input
  type:        FieldType;  // See supported types below
  stage:       string;     // Must match a value in stages[]
  required?:   boolean;    // Blocks advancement if empty
  placeholder?: string;   // For text / email / number / textarea
  options?:    string[];   // Required for radio / checkbox / select
}
```

| Property | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | ✅ | Unique field identifier — used as the key in `formData` |
| `label` | `string` | ✅ | Display label shown above the input |
| `type` | `FieldType` | ✅ | Input type (see supported types below) |
| `stage` | `string` | ✅ | Must exactly match one of the `stages` values |
| `required` | `boolean` | ❌ | If `true`, field must be filled before advancing |
| `placeholder` | `string` | ❌ | Placeholder text (text / email / number / textarea only) |
| `options` | `string[]` | ❌ | Required for `radio`, `checkbox`, and `select` |

---

## Supported Field Types

`type` is a union: `'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox'`

### `text`
```js
{ name: 'user_name', label: 'Full Name', type: 'text', stage: 'Personal Info', required: true, placeholder: 'John Doe' }
```

### `email`
```js
{ name: 'user_email', label: 'Email', type: 'email', stage: 'Personal Info', required: true, placeholder: 'john@example.com' }
```

### `number`
```js
{ name: 'user_age', label: 'Age', type: 'number', stage: 'Personal Info', required: false }
```

### `textarea`
```js
{ name: 'comments', label: 'Comments', type: 'textarea', stage: 'Feedback', placeholder: 'Write here...' }
```

### `select`
```js
{
  name: 'experience_level',
  label: 'Experience Level',
  type: 'select',
  stage: 'Preferences',
  required: true,
  options: ['Beginner', 'Intermediate', 'Advanced'],
}
```

### `radio` — single choice
```js
{
  name: 'satisfaction',
  label: 'How satisfied are you?',
  type: 'radio',
  stage: 'Feedback',
  required: true,
  options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
}
```

### `checkbox` — multi-select
```js
{
  name: 'interests',
  label: 'Areas of Interest',
  type: 'checkbox',
  stage: 'Preferences',
  required: true,
  options: ['Technology', 'Design', 'Marketing'],
}
```

> **Note:** `checkbox` values in `formData` are always a `string[]`.

---

## `formData` Shape

The object passed to `onSubmit` maps each field `name` to its value:

```ts
type FormData = Record<string, string | string[]>

// Example:
{
  user_name:        'Jane Doe',
  user_email:       'jane@example.com',
  experience_level: 'Intermediate',
  interests:        ['Technology', 'Design'],  // checkbox → string[]
  satisfaction:     'Very Satisfied',
  comments:         'Great experience!',
}
```

---

## Using Individual Components

### `<ProgressBar />`

```tsx
import { ProgressBar } from 'questionnaire-react';

<ProgressBar
  stages={['Step 1', 'Step 2', 'Step 3']}
  currentStageIndex={1}
/>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `stages` | `string[]` | ✅ | Ordered array of stage names |
| `currentStageIndex` | `number` | ✅ | Zero-based index of the active stage |

---

### `<FieldRenderer />`

Renders a single field with its label, input, and error message. Useful when building a fully custom layout.

```tsx
import { FieldRenderer } from 'questionnaire-react';

const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

<FieldRenderer
  field={{ name: 'email', label: 'Email', type: 'email', stage: 'Info', required: true }}
  value={formData.email}
  onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
  error={errors.email}
/>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `field` | `FieldConfig` | ✅ | A field config object |
| `value` | `string \| string[]` | ✅ | Current controlled value |
| `onChange` | `(name: string, value: string \| string[]) => void` | ✅ | Change handler |
| `error` | `string` | ❌ | Validation error message |

---

## Full Config Example

```js
import { formConfig } from 'questionnaire-react';
// Use the built-in sample as a reference
console.log(formConfig);
```

Or define your own:

```js
const config = {
  stages: ['Personal Info', 'Preferences', 'Feedback'],
  fields: [
    { name: 'user_name',    label: 'Full Name',           type: 'text',     required: true,  stage: 'Personal Info', placeholder: 'e.g. John Doe' },
    { name: 'user_email',   label: 'Email Address',       type: 'email',    required: true,  stage: 'Personal Info', placeholder: 'john@example.com' },
    { name: 'user_gender',  label: 'Gender',              type: 'radio',    required: false, stage: 'Personal Info', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
    { name: 'interests',    label: 'Areas of Interest',   type: 'checkbox', required: true,  stage: 'Preferences',   options: ['Technology', 'Design', 'Marketing', 'Engineering'] },
    { name: 'experience',   label: 'Experience Level',    type: 'select',   required: true,  stage: 'Preferences',   options: ['Beginner', 'Intermediate', 'Advanced'] },
    { name: 'satisfaction', label: 'Satisfaction',        type: 'radio',    required: true,  stage: 'Feedback',      options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] },
    { name: 'comments',     label: 'Additional Comments', type: 'textarea', required: false, stage: 'Feedback',      placeholder: 'Type your feedback here...' },
  ],
};
```

---

## TypeScript

This package ships with full TypeScript declarations. No `@types/` package needed.

```ts
import { Questionnaire } from 'questionnaire-react';
import type { QuestionnaireConfig, FormData } from 'questionnaire-react';

const config: QuestionnaireConfig = {
  stages: ['Info'],
  fields: [
    { name: 'name', label: 'Name', type: 'text', stage: 'Info', required: true },
  ],
};

const handleSubmit = (data: FormData) => {
  console.log(data.name); // string | string[]
};

<Questionnaire config={config} onSubmit={handleSubmit} />;
```

---

## Features

- ✅ JSON-driven — define your entire form without writing JSX
- ✅ Multi-stage with animated step-by-step navigation
- ✅ Built-in per-stage validation with inline error messages
- ✅ Supports `text`, `email`, `number`, `textarea`, `select`, `radio`, `checkbox`
- ✅ Smooth Framer Motion animations between stages
- ✅ Visual progress bar with stage labels
- ✅ Success screen on submission with reset capability
- ✅ Fully composable — use `FieldRenderer` and `ProgressBar` independently
- ✅ Full TypeScript types included — no extra `@types/` package needed
- ✅ Peer-dep range `react >= 18.0.0 < 20` — no unnecessary install conflicts

---

## License

[MIT](./LICENSE) © questionnaire-react contributors