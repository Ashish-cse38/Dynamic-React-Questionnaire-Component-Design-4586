# dynamic-react-questionnare-component

[![npm version](https://img.shields.io/npm/v/dynamic-react-questionnare-component.svg)](https://www.npmjs.com/package/dynamic-react-questionnare-component)
[![license](https://img.shields.io/npm/l/dynamic-react-questionnare-component.svg)](./LICENSE)
[![peer: react >=18](https://img.shields.io/badge/peer%20dep-react%20%3E%3D18-blue)](https://reactjs.org)

A dynamic, JSON-driven multi-step questionnaire component for React. Build fully functional multi-stage forms with built-in validation, smooth animations, and a clean progress indicator — all configured through a single JSON object. Zero form boilerplate.

---

## Installation

```bash
npm install dynamic-react-questionnare-component
```

> **Peer Dependencies** — your project must have `react` and `react-dom` installed:

```bash
npm install react react-dom
```

Supported peer versions: `react >=18.0.0 < 20`, `react-dom >=18.0.0 < 20`

---

## Tailwind setup (required)

This package uses Tailwind utility classes internally. Your Tailwind `content` must include this package so the classes are not purged.

### `tailwind.config.js` (Tailwind v3+)

Add the package path to `content`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/dynamic-react-questionnare-component/**/*.{js,ts,jsx,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
};
```

### pnpm users

If you use pnpm, dependencies may live under `node_modules/.pnpm`. Add this too:

```js
content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}',
  './node_modules/dynamic-react-questionnare-component/**/*.{js,ts,jsx,tsx}',
  './node_modules/.pnpm/**/node_modules/dynamic-react-questionnare-component/**/*.{js,ts,jsx,tsx}',
],
```

---

## Quick Start

```jsx
import React from 'react';
import { Questionnaire } from 'dynamic-react-questionnare-component';

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
| `ProgressBar` | Component | Backwards-compatible alias for `NumberedProgressBar1` |
| `NumberedProgressBar1` | Component | Numbered progress bar with fill track |
| `NamedProgressBar1` | Component | Stage-name progress bar (no numbers) with `>` separators |
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
  NumberedProgressBar1,
  NamedProgressBar1,
  formConfig,
} from 'dynamic-react-questionnare-component';

import type {
  QuestionnaireConfig,
  FieldConfig,
  FieldType,
  FormData,
} from 'dynamic-react-questionnare-component';
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
  onSubmit={(formData) =>
    fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
  }
/>
```

---

## Config Object

```ts
interface QuestionnaireConfig {
  stages: string[];      // Ordered list of stage names
  fields: FieldConfig[]; // All field definitions across all stages

  // Optional headings
  topHeading?: string;     // Outside the card (page-level)
  topSubHeading?: string;  // Outside the card (page-level)
  mainHeading?: string;    // Inside the card header
  subHeading?: string;     // Inside the card header

  // Optional stage header copy (supports {stage} token)
  stageHeading?: string;
  stageDescription?: string;

  // Progress bar UI
  progressBarVariant?: 'numberedprogressbar1' | 'namedprogressbar1';

  // Primary accent color used for themed UI (buttons, progress accents, stage heading)
  themeColor?: string;

  // Optional colors (CSS color strings)
  colors?: {
    background?: string;   // Outermost page background
    cardHeader?: string;   // Header background (color or gradient string)
    cardMain?: string;     // Main area background
    cardFooter?: string;   // Footer background
    headings?: {
      topHeading?: string;
      mainHeading?: string;
      stageHeading?: string;
    };
    subHeadings?: {
      topSubHeading?: string;
      subHeading?: string;
      stageDescription?: string;
    };
    text?: {
      default?: string;
      muted?: string;
    };
  };

  // Optional layout sizing (percent-based)
  area?: {
    cardWidthPercent?: number;   // 0–100 (% of container width)
    cardHeightPercent?: number;  // 0–100 (% of viewport height, via vh)
    headerPercent?: number;      // 0–100 (% of card height)
    footerPercent?: number;      // 0–100 (% of card height)
  };

  // Optional UI effects to run after successful submit
  EffectOnSubmit?: 'confetti' | 'bigCheck' | 'firework';

  // Success screen (after submit)
  endHeader?: string;
  endSubHeader?: string;
  enableStartOver?: boolean;

  // Show a scrollable preview page before final submit
  previewMode?: boolean;
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
  name: string;        // Unique key — appears in formData
  label: string;       // Displayed above the input
  type: FieldType;     // See supported types below
  stage: string;       // Must match a value in stages[]
  required?: boolean;  // Blocks advancement if empty
  placeholder?: string;// For text / email / number / textarea
  options?: string[];  // Required for radio / checkbox / select
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
  user_name: 'Jane Doe',
  user_email: 'jane@example.com',
  experience_level: 'Intermediate',
  interests: ['Technology', 'Design'], // checkbox → string[]
  satisfaction: 'Very Satisfied',
  comments: 'Great experience!',
}
```

---

## Using Individual Components

### `<ProgressBar />`

`ProgressBar` is a backwards-compatible alias for the numbered progress bar (`NumberedProgressBar1`).

```tsx
import { ProgressBar } from 'dynamic-react-questionnare-component';

<ProgressBar
  stages={['Step 1', 'Step 2', 'Step 3']}
  currentStageIndex={1}
/>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `stages` | `string[]` | ✅ | Ordered array of stage names |
| `currentStageIndex` | `number` | ✅ | Zero-based index of the active stage |

### Progress bar variants (via config)

Use the variant switch on `<Questionnaire />`:

```js
const config = {
  // ...
  progressBarVariant: 'namedprogressbar1', // or 'numberedprogressbar1'
};
```

### Styling (colors)

All values are regular CSS colors (hex/rgb/hsl/named colors). Example:

```js
const config = {
  // ...
  themeColor: '#16A34A', // green
  colors: {
    background: '#F1F5F9',
    // Optional: override header background.
    // If omitted, the header gets an automatic themeColor → white gradient.
    cardHeader: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, #FFFFFF 100%)',
    cardMain: '#FFFFFF',
    cardFooter: '#F8FAFC',
    headings: { stageHeading: '#16A34A' },
    text: { default: '#0F172A', muted: '#64748B' },
  },
};
```

### Layout (area)

You can optionally constrain the card size using percentages:

```js
const config = {
  // ...
  area: {
    cardWidthPercent: 100,
    cardHeightPercent: 86,
    headerPercent: 24,
    footerPercent: 10,
  },
};
```

If `cardHeightPercent` is set, the **main area becomes scrollable** automatically when content overflows (so the page itself doesn’t scroll).

### Special effects (after submit)

Available options:

- `confetti`: falling confetti
- `bigCheck`: large 3D check that drops into the center with a bounce
- `firework`: 3–5 colorful firework bursts

Example:

```js
const config = {
  // ...
  EffectOnSubmit: 'firework',
};
```

### Success screen (after submit)

Configure the final screen text and whether the reset button shows:

```js
const config = {
  // ...
  endHeader: 'Thanks!',
  endSubHeader: 'We received your response.\nWe appreciate your time.',
  enableStartOver: false,
};
```

---

### Preview mode (before submit)

When enabled, the last step becomes:

- **Preview** (shows a scrollable summary of all questions + answers grouped by stage)
- **Confirm & Submit**

```js
const config = {
  // ...
  previewMode: true,
};
```

### `<FieldRenderer />`

Renders a single field with its label, input, and error message. Useful when building a fully custom layout.

```tsx
import { FieldRenderer } from 'dynamic-react-questionnare-component';

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
import { formConfig } from 'dynamic-react-questionnare-component';

// Use the built-in sample as a reference
console.log(formConfig);
```

Or define your own:

```js
const config = {
  stages: ['Personal Info', 'Preferences', 'Feedback'],
  fields: [
    { name: 'user_name',   label: 'Full Name',          type: 'text',     required: true,  stage: 'Personal Info', placeholder: 'e.g. John Doe' },
    { name: 'user_email',  label: 'Email Address',      type: 'email',    required: true,  stage: 'Personal Info', placeholder: 'john@example.com' },
    { name: 'user_gender', label: 'Gender',              type: 'radio',    required: false, stage: 'Personal Info', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
    { name: 'interests',   label: 'Areas of Interest',  type: 'checkbox', required: true,  stage: 'Preferences',   options: ['Technology', 'Design', 'Marketing', 'Engineering'] },
    { name: 'experience',  label: 'Experience Level',   type: 'select',   required: true,  stage: 'Preferences',   options: ['Beginner', 'Intermediate', 'Advanced'] },
    { name: 'satisfaction',label: 'Satisfaction',       type: 'radio',    required: true,  stage: 'Feedback',      options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] },
    { name: 'comments',    label: 'Additional Comments',type: 'textarea', required: false, stage: 'Feedback',      placeholder: 'Type your feedback here...' },
  ],
};
```

---

## TypeScript

This package ships with full TypeScript declarations. No `@types/` package needed.

```ts
import { Questionnaire } from 'dynamic-react-questionnare-component';
import type { QuestionnaireConfig, FormData } from 'dynamic-react-questionnare-component';

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
- ✅ Peer-dep range `react >=18.0.0 < 20` — no unnecessary install conflicts

---

## Links

- **npm:** `https://www.npmjs.com/package/dynamic-react-questionnare-component`
- **GitHub:** `https://github.com/Ashish-cse38/Dynamic-React-Questionnaire-Component-Design-4586`
- **Issues:** `https://github.com/Ashish-cse38/Dynamic-React-Questionnaire-Component-Design-4586/issues`

---

## License

[MIT](./LICENSE) © questionnaire-react contributors