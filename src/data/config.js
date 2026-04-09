export const formConfig = {
  stages: ['Personal Info', 'Preferences', 'Feedback'],
  fields: [
    {
      name: 'user_name',
      label: 'What is your full name?',
      type: 'text',
      required: true,
      stage: 'Personal Info',
      placeholder: 'e.g. John Doe'
    },
    {
      name: 'user_email',
      label: 'What is your email address?',
      type: 'text',
      required: true,
      stage: 'Personal Info',
      placeholder: 'john@example.com'
    },
    {
      name: 'user_gender',
      label: 'What is your gender?',
      type: 'radio',
      required: false,
      stage: 'Personal Info',
      options: ['Male', 'Female', 'Non-binary', 'Prefer not to say']
    },
    {
      name: 'interests',
      label: 'Select your areas of interest',
      type: 'checkbox',
      required: true,
      stage: 'Preferences',
      options: ['Technology', 'Design', 'Marketing', 'Sales', 'Engineering']
    },
    {
      name: 'experience_level',
      label: 'What is your experience level?',
      type: 'select',
      required: true,
      stage: 'Preferences',
      options: ['Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Advanced (5+ years)']
    },
    {
      name: 'satisfaction',
      label: 'How satisfied are you with our service so far?',
      type: 'radio',
      required: true,
      stage: 'Feedback',
      options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied']
    },
    {
      name: 'additional_comments',
      label: 'Any additional comments or suggestions?',
      type: 'textarea',
      required: false,
      stage: 'Feedback',
      placeholder: 'Type your feedback here...'
    }
  ]
};