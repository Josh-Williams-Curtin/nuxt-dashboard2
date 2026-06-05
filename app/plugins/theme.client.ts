export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig()

  const saved = localStorage.getItem('theme-colors')
  if (saved) {
    try {
      const { primary, secondary, neutral } = JSON.parse(saved)
      if (primary) appConfig.ui.colors.primary = primary
      if (secondary) appConfig.ui.colors.secondary = secondary
      if (neutral) appConfig.ui.colors.neutral = neutral
    } catch {}
  }

  watch(
    () => [appConfig.ui.colors.primary, appConfig.ui.colors.secondary, appConfig.ui.colors.neutral],
    ([primary, secondary, neutral]) => {
      localStorage.setItem('theme-colors', JSON.stringify({ primary, secondary, neutral }))
    }
  )
})
