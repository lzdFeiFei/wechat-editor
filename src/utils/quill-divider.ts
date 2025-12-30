import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class DividerBlot extends BlockEmbed {
  static blotName = 'divider'
  static tagName = 'hr'
  static className = 'ql-divider'

  static create() {
    const node = super.create() as HTMLElement
    node.setAttribute('contenteditable', 'false')
    node.style.border = 'none'
    node.style.borderTop = '2px solid #e5e7eb'
    node.style.margin = '20px 0'
    node.style.padding = '0'
    return node
  }
}

export function registerDivider() {
  Quill.register(DividerBlot)
}
