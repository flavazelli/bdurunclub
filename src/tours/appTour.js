export const appTourSteps = [
  {
    target: '.upcoming-runs', // Selector for the upcoming runs section
    content: 'Here you can find all the upcoming runs.',
    params: {
      placement: 'bottom', // Tooltip placement
    },
  },
  {
    target: '.run-card', // Selector for the upcoming runs section
    content: 'Click on a run to see its details and registration button.',
    params: {
      placement: 'right', // Tooltip placement
    },
  },
  {
    target: '.registered-runs', // Selector for the registered runs section
    content:
      'This section shows the runs you have registered for. You can unregister here if needed.',
    params: {
      placement: 'bottom',
    },
  },
  {
    target: '.update-profile', // Selector for the update profile button
    content: 'Click here to update your profile, including your level, pace, and residency status.',
    params: {
      placement: 'top',
    },
  },
]
