import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TourStep {
  target: string // CSS选择器
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '.style-panel',
    title: '样式工具栏',
    description: '在这里设置文字样式、颜色、对齐方式，并插入图片、引用框等特殊组件。',
    position: 'right',
  },
  {
    target: '.editor-area',
    title: '编辑区',
    description: '在此编辑文章内容。支持拖拽上传图片，Ctrl+S 保存，Ctrl+Z/Y 撤销重做。',
    position: 'top',
  },
  {
    target: '.preview-area',
    title: '实时预览',
    description: '手机视图预览，所见即所得。查看文章在微信公众号中的最终效果。',
    position: 'left',
  },
  {
    target: '.toolbar-area',
    title: '工具栏',
    description: '一键复制到微信公众号后台，或清空当前内容重新开始。',
    position: 'top',
  },
  {
    target: '.template-button',
    title: '模板功能',
    description: '使用预设模板快速开始，或将当前内容保存为自定义模板。',
    position: 'bottom',
  },
  {
    target: '.draft-button',
    title: '草稿管理',
    description: '保存多个草稿（最多10个），随时切换和编辑。',
    position: 'bottom',
  },
]

const ONBOARDING_KEY = 'wechat_editor_onboarding_completed'

interface OnboardingTourProps {
  onComplete: () => void
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    // 检查是否已完成引导
    const completed = localStorage.getItem(ONBOARDING_KEY)
    if (!completed) {
      // 延迟显示，等待DOM加载
      setTimeout(() => {
        setIsVisible(true)
        updateTargetRect()
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isVisible) {
      updateTargetRect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isVisible])

  const updateTargetRect = () => {
    const step = TOUR_STEPS[currentStep]
    const element = document.querySelector(step.target)
    if (element) {
      setTargetRect(element.getBoundingClientRect())
    }
  }

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setIsVisible(false)
    onComplete()
  }

  if (!isVisible || !targetRect) return null

  const step = TOUR_STEPS[currentStep]

  // 计算提示框位置
  const getTooltipPosition = () => {
    const padding = 20
    let top = 0
    let left = 0

    switch (step.position) {
      case 'top':
        top = targetRect.top - 180
        left = targetRect.left + targetRect.width / 2 - 175
        break
      case 'bottom':
        top = targetRect.bottom + padding
        left = targetRect.left + targetRect.width / 2 - 175
        break
      case 'left':
        top = targetRect.top + targetRect.height / 2 - 100
        left = targetRect.left - 370
        break
      case 'right':
        top = targetRect.top + targetRect.height / 2 - 100
        left = targetRect.right + padding
        break
    }

    return { top, left }
  }

  const tooltipPos = getTooltipPosition()

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[100]" onClick={handleSkip} />

      {/* 高亮区域 */}
      <div
        className="fixed border-4 border-primary rounded-lg z-[101] pointer-events-none animate-pulse"
        style={{
          top: targetRect.top - 8,
          left: targetRect.left - 8,
          width: targetRect.width + 16,
          height: targetRect.height + 16,
        }}
      />

      {/* 提示框 */}
      <div
        className="fixed bg-white rounded-lg shadow-2xl p-6 w-[350px] z-[102] animate-fadeIn"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
            <p className="text-sm text-gray-600">{step.description}</p>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>
              步骤 {currentStep + 1} / {TOUR_STEPS.length}
            </span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            跳过引导
          </button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {currentStep < TOUR_STEPS.length - 1 ? (
                <>
                  下一步
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  完成
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
