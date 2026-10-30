import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** Section number, shown as "01" before the label. */
  index?: number
  /** Centred variant draws the rule on both sides. */
  align?: 'start' | 'center'
  className?: string
}

/**
 * The `[ 01  LABEL ]` section marker: the brand's bracket motif with a section
 * number and a green rule that draws out from it. Brackets, number and rule
 * are decorative; screen readers get the label only.
 */
export function Eyebrow({ children, index, align = 'start', className = '' }: Props) {
  const rule = <span className="eyebrow__rule" aria-hidden="true" />
  return (
    <p className={`eyebrow eyebrow--${align} ${className}`} data-reveal>
      {align === 'center' && rule}
      <span className="eyebrow__frame">
        <span className="eyebrow__bracket eyebrow__bracket--l" aria-hidden="true">
          [
        </span>
        {index !== undefined && (
          <span className="eyebrow__num" aria-hidden="true">
            {String(index).padStart(2, '0')}
          </span>
        )}
        <span className="eyebrow__label">{children}</span>
        <span className="eyebrow__bracket eyebrow__bracket--r" aria-hidden="true">
          ]
        </span>
      </span>
      {rule}
    </p>
  )
}
