# questionnaire-react

A dynamic, JSON-driven multi-step questionnaire component for React. Build fully functional multi-stage forms with built-in validation, smooth animations, and a clean progress indicator — all configured through a single JSON object.

---

## Installation

```bash
npm install questionnaire-react
```

> **Peer Dependencies:** Make sure your project has `react` and `react-dom` installed (v18+).

```bash
npm install react react-dom
```

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
  const handleSubmit = (formData) => {
    console.log('Submitted:', formData);
    // Send to your API here
  };

  return <Questionnaire config={config} onSubmit={handleSubmit} />;
}

export default App;
```

---

## Exports

| Export | Type | Description |
|---|---|---|
| `Questionnaire` | Component | The main multi-step form component |
| `FieldRenderer` | Component | Renders a single field — useful for custom layouts |
| `ProgressBar` | Component | Stage progress indicator |
| `formConfig` | Object | A sample config you can use as a starting template |

```js
import { Questionnaire, FieldRenderer, ProgressBar, formConfig } from 'questionnaire-react';
```

---

## `<Questionnaire />`

The primary component. Handles stage navigation, validation, and submission.

### Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `config` | `Object` | ✅ | The form configuration object (see Config below) |
| `onSubmit` | `Function` | ❌ | Callback fired on final submission. Receives `formData` object |

```jsx
<Questionnaire
  config={config}
  onSubmit={(formData) => console.log(formData)}
/>
```

---

## Config Object

The `config` prop drives everything — stages, fields, types, and validation.

```js
const config = {
  stages: ['Stage One', 'Stage Two'],  // Array of stage names (in order)
  fields: [ /* Field objects */ ],
};
```

### `stages`

An ordered array of stage name strings. Each stage becomes a step in the progress bar.

```js
stages: ['Personal Info', 'Preferences', 'Feedback']
```

---

## Field Object

Each item in the `fields` array defines one form input.

| Property | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | ✅ | Unique field identifier (used as the key in `formData`) |
| `label` | `string` | ✅ | Display label shown above the input |
| `type` | `string` | ✅ | Input type (see supported types below) |
| `stage` | `string` | ✅ | Must exactly match one of the `stages` values |
| `required` | `boolean` | ❌ | If `true`, field must be filled before advancing |
| `placeholder` | `string` | ❌ | Placeholder text (for `text`, `email`, `number`, `textarea`) |
| `options` | `string[]` | ❌ | Required for `radio`, `checkbox`, and `select` types |

---

## Supported Field Types

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

### `radio` *(single choice)*
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

### `checkbox` *(multi-select)*
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

> **Note:** `checkbox` fields return an **array** of selected values in `formData`.

---

## `formData` Shape

The object passed to `onSubmit` maps each field's `name` to its value:

```js
{
  user_name: 'Jane Doe',
  user_email: 'jane@example.com',
  experience_level: 'Intermediate',
  interests: ['Technology', 'Design'],   // checkbox → array
  satisfaction: 'Very Satisfied',
  comments: 'Great experience!'
}
```

---

## Using Individual Components

### `<ProgressBar />`

```jsx
import { ProgressBar } from 'questionnaire-react';

<ProgressBar
  stages={['Step 1', 'Step 2', 'Step 3']}
  currentStageIndex={1}
/>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `stages` | `string[]` | ✅ | Array of stage names |
| `currentStageIndex` | `number` | ✅ | Zero-based index of the active stage |

---

### `<FieldRenderer />`

```jsx
import { FieldRenderer } from 'questionnaire-react';

<FieldRenderer
  field={{ name: 'email', label: 'Email', type: 'email', required: true }}
  value={formData.email}
  onChange={(name, value) => setFormData(prev => ({ ...prev, [name]: value }))}
  error={errors.email}
/>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `field` | `Object` | ✅ | A field config object |
| `value` | `any` | ✅ | Current value of the field |
| `onChange` | `Function` | ✅ | Called with `(name, value)` on change |
| `error` | `string` | ❌ | Error message to display below the field |

---

## Full Config Example

```js
import { formConfig } from 'questionnaire-react';
// Use the built-in sample config as a reference or starting point
console.log(formConfig);
```

Or define your own:

```js
const config = {
  stages: ['Personal Info', 'Preferences', 'Feedback'],
  fields: [
    { name: 'user_name',    label: 'Full Name',          type: 'text',     required: true,  stage: 'Personal Info', placeholder: 'e.g. John Doe' },
    { name: 'user_email',   label: 'Email Address',      type: 'email',    required: true,  stage: 'Personal Info', placeholder: 'john@example.com' },
    { name: 'user_gender',  label: 'Gender',             type: 'radio',    required: false, stage: 'Personal Info', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] },
    { name: 'interests',    label: 'Areas of Interest',  type: 'checkbox', required: true,  stage: 'Preferences',   options: ['Technology', 'Design', 'Marketing', 'Engineering'] },
    { name: 'experience',   label: 'Experience Level',   type: 'select',   required: true,  stage: 'Preferences',   options: ['Beginner', 'Intermediate', 'Advanced'] },
    { name: 'satisfaction', label: 'Satisfaction',       type: 'radio',    required: true,  stage: 'Feedback',      options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'] },
    { name: 'comments',     label: 'Additional Comments',type: 'textarea', required: false, stage: 'Feedback',      placeholder: 'Type your feedback here...' },
  ],
};
```

---

## Features

- ✅ JSON-driven — no JSX required to define your form
- ✅ Multi-stage with animated step-by-step navigation
- ✅ Built-in per-stage validation with inline error messages
- ✅ Supports `text`, `email`, `number`, `textarea`, `select`, `radio`, `checkbox`
- ✅ Smooth Framer Motion animations between stages
- ✅ Visual progress bar with stage labels
- ✅ Success screen on submission with reset capability
- ✅ Fully composable — use individual components independently

---

## License

MIT