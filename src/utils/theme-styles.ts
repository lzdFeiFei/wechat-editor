import { Theme } from '@/types/theme'

// 生成主题 CSS 样式
export function generateThemeStyles(theme: Theme): string {
  return `
    .preview-content h1,
    .preview-content h2,
    .preview-content h3 {
      color: ${theme.colors.headingColor};
    }

    .preview-content h1 {
      border-left-color: ${theme.colors.primary};
    }

    .preview-content h2 {
      border-left-color: ${theme.colors.primary};
    }

    .preview-content p,
    .preview-content li {
      color: ${theme.colors.textColor};
    }

    .preview-content a {
      color: ${theme.colors.linkColor};
    }

    .preview-content blockquote {
      background-color: ${theme.colors.quoteBackground};
      border-left-color: ${theme.colors.quoteBorder};
    }

    .preview-content hr,
    .preview-content .ql-divider {
      border-top-color: ${theme.colors.dividerColor};
    }
  `
}
