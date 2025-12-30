import { useState, useEffect, useCallback } from 'react'
import { Template, PRESET_TEMPLATES } from '@/types/template'
import { Theme } from '@/types/theme'

const CUSTOM_TEMPLATES_KEY = 'wechat_editor_custom_templates'
const MAX_CUSTOM_TEMPLATES = 10

export function useTemplates() {
  const [customTemplates, setCustomTemplates] = useState<Template[]>([])
  const [allTemplates, setAllTemplates] = useState<Template[]>([])

  // 加载自定义模板
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY)
      if (stored) {
        const templates = JSON.parse(stored) as Template[]
        setCustomTemplates(templates)
        setAllTemplates([...PRESET_TEMPLATES, ...templates])
      } else {
        setAllTemplates(PRESET_TEMPLATES)
      }
    } catch (error) {
      console.error('Failed to load custom templates:', error)
      setAllTemplates(PRESET_TEMPLATES)
    }
  }, [])

  // 保存自定义模板到localStorage
  const saveCustomTemplates = useCallback((templates: Template[]) => {
    try {
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates))
      setCustomTemplates(templates)
      setAllTemplates([...PRESET_TEMPLATES, ...templates])
    } catch (error) {
      console.error('Failed to save custom templates:', error)
      throw new Error('保存失败，请重试')
    }
  }, [])

  // 添加自定义模板
  const addCustomTemplate = useCallback(
    (name: string, description: string, content: string, theme: Theme) => {
      if (customTemplates.length >= MAX_CUSTOM_TEMPLATES) {
        throw new Error(`最多只能保存 ${MAX_CUSTOM_TEMPLATES} 个自定义模板`)
      }

      const newTemplate: Template = {
        id: `custom_${Date.now()}`,
        name,
        description,
        category: 'custom',
        theme,
        content,
        preview: 'custom',
        createdAt: Date.now(),
      }

      const updatedTemplates = [...customTemplates, newTemplate]
      saveCustomTemplates(updatedTemplates)

      return newTemplate
    },
    [customTemplates, saveCustomTemplates]
  )

  // 删除自定义模板
  const deleteCustomTemplate = useCallback(
    (templateId: string) => {
      const updatedTemplates = customTemplates.filter(t => t.id !== templateId)
      saveCustomTemplates(updatedTemplates)
    },
    [customTemplates, saveCustomTemplates]
  )

  // 获取模板
  const getTemplate = useCallback(
    (templateId: string): Template | undefined => {
      return allTemplates.find(t => t.id === templateId)
    },
    [allTemplates]
  )

  return {
    presetTemplates: PRESET_TEMPLATES,
    customTemplates,
    allTemplates,
    addCustomTemplate,
    deleteCustomTemplate,
    getTemplate,
  }
}
