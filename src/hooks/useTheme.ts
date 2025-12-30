import { useState, useCallback } from 'react'
import { Theme, DEFAULT_THEME, getThemeById } from '@/types/theme'

const STORAGE_KEY = 'wechat_editor_theme'

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const themeId = JSON.parse(saved)
        const theme = getThemeById(themeId)
        return theme || DEFAULT_THEME
      }
    } catch (error) {
      console.error('Failed to load theme:', error)
    }
    return DEFAULT_THEME
  })

  const applyTheme = useCallback((theme: Theme) => {
    setCurrentTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme.id))
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }, [])

  return {
    currentTheme,
    applyTheme,
  }
}
