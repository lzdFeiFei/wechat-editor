import { Theme } from './theme'

export interface Template {
  id: string
  name: string
  description: string
  category: 'preset' | 'custom'
  theme: Theme
  content: string
  preview: string // 预览图片URL或base64
  createdAt?: number
}

// 5套预设模板
export const PRESET_TEMPLATES: Template[] = [
  {
    id: 'minimalist',
    name: '简约风格',
    description: '简洁大方，适合日常文章',
    category: 'preset',
    theme: {
      id: 'classic',
      name: '经典黑白',
      description: '黑色标题，深灰正文，经典耐看',
      colors: {
        primary: '#000000',
        headingColor: '#1a1a1a',
        textColor: '#333333',
        linkColor: '#3b82f6',
        quoteBackground: '#f5f5f5',
        quoteBorder: '#d1d5db',
        dividerColor: '#e5e7eb',
      },
    },
    content: `<h2>标题：在这里输入你的文章标题</h2>
<p><br></p>
<p>正文从这里开始。这是一个简约风格的模板，适合大多数场景。</p>
<p><br></p>
<p>你可以在这里继续编写内容...</p>`,
    preview: 'minimalist',
  },
  {
    id: 'business',
    name: '商务风格',
    description: '专业正式，适合企业宣传',
    category: 'preset',
    theme: {
      id: 'tech-blue',
      name: '科技蓝',
      description: '蓝色主题，现代科技感',
      colors: {
        primary: '#3b82f6',
        headingColor: '#1e40af',
        textColor: '#374151',
        linkColor: '#2563eb',
        quoteBackground: '#eff6ff',
        quoteBorder: '#3b82f6',
        dividerColor: '#93c5fd',
      },
    },
    content: `<h1>【公司动态】标题</h1>
<p><br></p>
<blockquote>核心观点：在这里总结文章的核心观点或亮点</blockquote>
<p><br></p>
<h2>一、背景介绍</h2>
<p>在这里介绍相关背景信息...</p>
<p><br></p>
<h2>二、主要内容</h2>
<p>详细阐述主要内容...</p>
<p><br></p>
<h2>三、总结展望</h2>
<p>总结全文，展望未来...</p>`,
    preview: 'business',
  },
  {
    id: 'literary',
    name: '文艺风格',
    description: '优雅细腻，适合散文随笔',
    category: 'preset',
    theme: {
      id: 'elegant-purple',
      name: '优雅紫',
      description: '紫色主题，优雅高贵',
      colors: {
        primary: '#8b5cf6',
        headingColor: '#5b21b6',
        textColor: '#374151',
        linkColor: '#7c3aed',
        quoteBackground: '#f5f3ff',
        quoteBorder: '#8b5cf6',
        dividerColor: '#c4b5fd',
      },
    },
    content: `<h3>✨ ${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</h3>
<p><br></p>
<p style="text-align: center;"><em>在这里写下你的心情或引言</em></p>
<p><br></p>
<hr class="ql-divider">
<p><br></p>
<p>正文从这里开始，娓娓道来你的故事...</p>
<p><br></p>
<blockquote>"在这里引用一句话"</blockquote>
<p><br></p>
<p>继续你的文字...</p>`,
    preview: 'literary',
  },
  {
    id: 'tech',
    name: '科技风格',
    description: '现代简洁，适合技术文章',
    category: 'preset',
    theme: {
      id: 'tech-blue',
      name: '科技蓝',
      description: '蓝色主题，现代科技感',
      colors: {
        primary: '#3b82f6',
        headingColor: '#1e40af',
        textColor: '#374151',
        linkColor: '#2563eb',
        quoteBackground: '#eff6ff',
        quoteBorder: '#3b82f6',
        dividerColor: '#93c5fd',
      },
    },
    content: `<h1>🚀 技术分享：标题</h1>
<p><br></p>
<h2>📋 目录</h2>
<ul>
<li>前言</li>
<li>核心概念</li>
<li>实践案例</li>
<li>总结</li>
</ul>
<p><br></p>
<hr class="ql-divider">
<p><br></p>
<h2>💡 前言</h2>
<p>在这里介绍技术背景...</p>
<p><br></p>
<h2>🔧 核心概念</h2>
<p>详细讲解核心技术点...</p>
<p><br></p>
<blockquote>💡 提示：这里可以加入重要的注意事项</blockquote>`,
    preview: 'tech',
  },
  {
    id: 'playful',
    name: '活泼风格',
    description: '轻松有趣，适合生活分享',
    category: 'preset',
    theme: {
      id: 'warm-orange',
      name: '温暖橙',
      description: '橙色主题，温暖活力',
      colors: {
        primary: '#f59e0b',
        headingColor: '#b45309',
        textColor: '#374151',
        linkColor: '#d97706',
        quoteBackground: '#fffbeb',
        quoteBorder: '#f59e0b',
        dividerColor: '#fcd34d',
      },
    },
    content: `<h2>🎉 ${new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} 今日分享</h2>
<p><br></p>
<p>Hi 大家好呀！👋</p>
<p><br></p>
<p>今天要和大家分享...</p>
<p><br></p>
<blockquote>📌 小贴士：记得点赞收藏哦～</blockquote>
<p><br></p>
<h3>✨ 第一部分</h3>
<p>内容开始...</p>
<p><br></p>
<h3>✨ 第二部分</h3>
<p>继续分享...</p>
<p><br></p>
<hr class="ql-divider">
<p><br></p>
<p style="text-align: center;">❤️ 感谢阅读，我们下次见！</p>`,
    preview: 'playful',
  },
]
