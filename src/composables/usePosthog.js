// src/composables/usePostHog.js
import posthog from 'posthog-js'

export function usePostHog() {
  posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
    api_host: 'https://us.i.posthog.com',
  })

  return {
    posthog,
  }
}
