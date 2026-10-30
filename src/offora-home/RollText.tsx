import type { CSSProperties } from 'react'

/**
 * Letter roll: every glyph is stacked twice; hovering the nearest `.roll-host`
 * slides each column up one line, staggered left to right. Glyphs are grouped
 * per word so long lines only wrap between words. Screen readers get the plain
 * text via aria-label.
 */
export function RollText({ text, className = '' }: { text: string; className?: string }) {
  let i = 0
  return (
    <span className={`roll ${className}`} aria-label={text} role="text">
      {text.split(' ').map((word, w) => (
        <span className="roll__word" key={w} aria-hidden="true">
          {[...word].map((ch) => {
            const n = i++
            return (
              <span className="roll__char" key={n} style={{ '--i': n } as CSSProperties}>
                <span>{ch}</span>
                <span>{ch}</span>
              </span>
            )
          })}
        </span>
      ))}
    </span>
  )
}
