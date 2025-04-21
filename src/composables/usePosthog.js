import { getCurrentInstance } from 'vue'

export function usePosthog() {
  const { appContext } = getCurrentInstance()
  return appContext.config.globalProperties.$posthog
}
